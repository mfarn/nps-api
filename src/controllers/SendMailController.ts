import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { UserSurveyRepository } from '../repositories/UserSurveyRepository';

class SendMailController {

    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const usersSurveyRepository = getCustomRepository(UserSurveyRepository);

        const userAlreadyExists = await usersRepository.findOne({email});

        if(!userAlreadyExists) {
            return response.status(400).json({
                error: "User doesn't exist!"
            });
        }

        /* typeorm maps id: survey_id, the property inside survey is "id" 
        but the controller receives "survey_id" */
        const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id})

        if(!surveyAlreadyExists) {
            return response.status(400).json({
                error: "Survey does not exist!"
            })
        }

        const userSurvey = usersSurveyRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });

        await usersSurveyRepository.save(userSurvey);
        //Send email to user

        return response.json(userSurvey);
    }
}

export { SendMailController }