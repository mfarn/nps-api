import { Repository, EntityRepository } from 'typeorm';
import { UserSurvey } from '../models/UserSurvey'

@EntityRepository(UserSurvey)
class UserSurveyRepository extends Repository<UserSurvey> {


}

export { UserSurveyRepository }