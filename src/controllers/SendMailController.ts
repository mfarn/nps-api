import { Request, Response } from 'express';
import { resolve } from 'path';
import { getCustomRepository, Not, IsNull } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { UserSurveyRepository } from '../repositories/UserSurveyRepository';
import SendMailService from '../services/SendMailService';

class SendMailController {

    async execute(request: Request, response: Response) {
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const usersSurveyRepository = getCustomRepository(UserSurveyRepository);

        const user = await usersRepository.findOne({email});

        if(!user) {
            return response.status(400).json({
                error: "User doesn't exist!"
            });
        }

        /* typeorm maps id: survey_id, the property inside survey is "id" 
        but the controller receives "survey_id" */
        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey) {
            return response.status(400).json({
                error: "Survey does not exist!"
            })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const userSurveyAlreadyAnswered = await usersSurveyRepository.findOne({
            where: {user_id: user.id, value: Not(IsNull()), survey_id: survey_id },
        });

        if(userSurveyAlreadyAnswered) {
            return response.status(400).json({
                error: "Survey already sent to this user!"
            })
        }

        const userSurveyAlreadyExists = await usersSurveyRepository.findOne({
            where: {user_id: user.id, value: null, survey_id: survey_id},
            relations: ["user", "survey"]
        });

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if (userSurveyAlreadyExists) {
            variables.id = userSurveyAlreadyExists.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(userSurveyAlreadyExists);
        }

        const userSurvey = usersSurveyRepository.create({
            user_id: user.id,
            survey_id
        });

        await usersSurveyRepository.save(userSurvey);

        variables.id = userSurvey.id;
       
        //Send email to user
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(userSurvey);
    }
}

export { SendMailController }