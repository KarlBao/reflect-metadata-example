import 'reflect-metadata'
import { JsonProperty, Serializable, deserialize } from './src/lib'

@Serializable()
class Member {
  @JsonProperty()
  id: number = 0

  @JsonProperty('username')
  name: string = ''
}

@Serializable()
class Team {
  @JsonProperty()
  public id: number = 0

  @JsonProperty('team_name')
  public name: string = ''

  @JsonProperty({
    type: Member,
    name: 'team_members'
  })
  public members: Member[] = []

  public get size () {
    return this.members.length
  }
}

const TEAM_MOCK_DATA = require('./mock_data.json') // 模拟动态数据请求
console.log(TEAM_MOCK_DATA)
const team = deserialize(TEAM_MOCK_DATA, Team)
console.log(team.members)