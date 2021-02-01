import {Json} from './Json/Json'

let j = Json.encode('{\"aaa\" = 1}')
print(Json.decode(j))