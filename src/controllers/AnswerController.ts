import { getCustomRepository } from "typeorm";
import { Request, Response } from 'express';
import { UserSurveyRepository } from '../repositories/UserSurveyRepository';

class AnswerController {

    async execute(request: Request, response: Response) {

        const { value } = request.params;
        const { u } = request.query;

        const usersSurveyRepository = getCustomRepository(UserSurveyRepository);

        const userSurvey = await usersSurveyRepository.findOne({
            id: String(u),
        });

        if(!userSurvey) {
            return response.status(400).json({
                error: "User survey does not exist!"
            })
        }

        userSurvey.value = Number(value);

        await usersSurveyRepository.save(userSurvey);

        return response.json(userSurvey);
    }

}

export { AnswerController }