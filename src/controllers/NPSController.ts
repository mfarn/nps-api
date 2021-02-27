import {Request, Response} from 'express';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { UserSurveyRepository } from '../repositories/UserSurveyRepository';

class NPSController {
    async execute(request: Request, response: Response) {

        const { survey_id } = request.params;

        const userSurveyRepository = getCustomRepository(UserSurveyRepository);

        const usersSurvey = await userSurveyRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractors = usersSurvey.filter(
            (survey) => survey.value >=0 && survey.value <=6
        ).length;

        const promoters = usersSurvey.filter(
            (survey) => survey.value == 9 || survey.value == 10
        ).length;

        const passive = usersSurvey.filter(
            (survey) => survey.value == 7 || survey.value == 8
        ).length;

        const totalAnswers = usersSurvey.length;

        const npsScore = Number((((promoters - detractors)/totalAnswers)*100).toFixed(2));

        return response.json({
            detractors,
            promoters,
            passive,
            npsScore
        })

    }

}

export { NPSController }