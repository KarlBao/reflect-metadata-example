import { ConstructorOf, IAllPropertiesMetaData, IJsonPropertyOption } from './types'
import { checkIsSerializable, createPropDataMetaKey, createSerializableMetaKey } from './utils'

/**
 * 标记目标 Class 为可序列化 Class.
 */
function Serializable () {
  return function (target: object) {
    // 标记 SERIALIZABLE.
    const serializableMetaKey = createSerializableMetaKey()
    Reflect.defineMetadata(serializableMetaKey, true, target)
  }
}

/**
 * 标记目标属性为序列化属性.
 *
 * @param {string | IJsonPropertyOption} [param]
 */
function JsonProperty (param?: string | IJsonPropertyOption) {
  return function (targetClass: object, propName: string) {
    // propsMetaData 存储当前 Class 中被 @JsonProperty 装饰的属性的元信息.
    let propsMetaData: IAllPropertiesMetaData = {}

    // 从全局元信息池中获取此 Class 的 prop 元数据对象.
    // 也就是之前可能存在的 metaData.
    const propsDataMetaKey = createPropDataMetaKey()
    if (Reflect.hasMetadata(propsDataMetaKey, targetClass)) {
      propsMetaData = Reflect.getMetadata(propsDataMetaKey, targetClass)
    }

    propsMetaData[propName] = createJsonPropertyMetaData(propName, param)
    Reflect.defineMetadata(propsDataMetaKey, propsMetaData, targetClass)
  }
}

/**
 * 创建 prop 的元信息.
 *
 * @param {string} propName
 * @param {string | IJsonPropertyOption} [param]
 * @returns {IJsonPropertyOption}
 */
function createJsonPropertyMetaData (propName: string, param?: string | IJsonPropertyOption): IJsonPropertyOption {
  const result: IJsonPropertyOption = Object.create(null)

  switch (typeof param) {
    // 如果用户没有在 @JsonProperty 传入任何参数, 则使用 propName 本身作为数据源键名.
    case 'undefined':
      result.name = propName
      break

    // 如果用户在 @JsonProperty 传入 string, 则使用此 string 作为数据源键名.
    case 'string':
      result.name = param
      break

    // 如果用户在 @JsonProperty 传入 JsonPropertyConfig, 则使用其中的 name 作为数据源键名.
    default:
      result.name = param.name || propName
      result.type = param.type
      break
  }

  return result
}

/**
 * 序列化 JSON 至目标类型.
 *
 * @template T
 * @param {object} dataSource
 * @param {ConstructorOf<T>} targetType
 * @returns {T}
 */
function deserialize<T> (dataSource: object, targetType: ConstructorOf<T>): T {
  const instance = new targetType()

  // 检查 targetClass 是否被 @Serializable 装饰, 如果没有则直接返回实例.
  if (!checkIsSerializable(targetType)) {
    return instance
  }

  const propsDataMetaKey = createPropDataMetaKey()

  // 取 MetaData 时需要从原型对象上取.
  // JS 的 MetaData 具有继承行为，会挨个去 __proto__ 上取 MetaData, 所以一定会取到基类的元数据.
  // 所以这里的数据是包含基类的.
  const propsMetaData: IAllPropertiesMetaData = Reflect.getMetadata(propsDataMetaKey, targetType.prototype)
  Object.keys(propsMetaData).forEach(propName => {
    const propMetaData = propsMetaData[propName]
    const jsonValue = dataSource[propMetaData.name]
    if (typeof jsonValue !== 'undefined' && jsonValue !== null) {
      const modelValue = createModelValueFromJson(instance, propName, propMetaData, jsonValue)
      if (modelValue !== null && typeof modelValue !== 'undefined') {
        instance[propName] = modelValue
      }
    }
  })

  return instance
}

/**
 * 判断目标类型是否为数组
 * @param propMetaData
 * @param instance
 * @param propName
 */
function isTargetArrayType (propMetaData: IJsonPropertyOption, instance, propName): boolean {
  const typeObj = Reflect.getMetadata('design:type', instance, propName)
  if (typeObj === Array) {
    return true
  }
  // 处理 any 的情况：当类型给了 any，且在 propMetaData 中提供了 types 的情形，默认目标类型可为数组。
  return typeObj === Object && !!propMetaData.type
}

/**
 * 将 JSON 数据转化为模型数据.
 *
 * @param {*} instance
 * @param {string} propName
 * @param {IJsonPropertyOption} propMetaData
 * @param {*} jsonValue
 * @returns
 */
function createModelValueFromJson (
  instance: any, propName: string, propMetaData: IJsonPropertyOption, jsonValue: any
) {
  // 获取 Type 的原始对象, 此对象是一个原始 Function, 如 Number, Array, SomeClass 等.
  const targetTypeObject: any =
    propMetaData.type ||
    Reflect.getMetadata('design:type', instance, propName)  // 从 instance 中尝试获取类型作为 fallback.

  const typeName = targetTypeObject.name.toLowerCase()

  // 如果目标类型非 @Serializable 装饰类型则直接处理.
  if (!checkIsSerializable(targetTypeObject)) {
    switch (typeName) {
      case 'number':
        return isNaN(jsonValue) ? undefined : jsonValue

      case 'string':
        return typeof jsonValue === 'string' ? jsonValue : undefined

      case 'boolean':
        return typeof jsonValue === 'boolean' ? jsonValue : undefined

      case 'date':
        return isNaN(Date.parse(jsonValue)) ? undefined : new Date(jsonValue)

      // 非装饰的数组和对象, 不做类型检查, 直接赋值.
      default:
        return jsonValue
    }
  }

  const sourceIsArray = Object.prototype.toString.call(jsonValue) === '[object Array]'
  const targetIsArray = isTargetArrayType(propMetaData, instance, propName)

  // 如果结果是数组类型则递归内部成员.
  if (sourceIsArray && targetIsArray) {
    const result = []
    jsonValue.forEach(item => {
      result.push(deserialize(item, targetTypeObject))
    })
    return result
  } else if (targetIsArray !== sourceIsArray) {
    return null
  }

  return deserialize(jsonValue, targetTypeObject)
}

export {
  JsonProperty,
  Serializable,
  deserialize
}
