import {Request, Response} from 'express';
import { getCustomRepository, getRepository} from "typeorm"
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';

class UserController {
    async create(request: Request, response: Response) {
        const {name, email} = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().required(),
        });

        try {
            await schema.validate(request.body, {abortEarly: false });
        } catch(err) {
            return response.status(400).json({error: err})
        }

        const usersRepository = getCustomRepository(UsersRepository);

        // SELECT * FROM USER WHERE EMAIL = "EMAIL" == findOne
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        if(userAlreadyExists) {
            return response.status(400).json({
                error: "User already exists"
            })
        }

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user); 

        return response.status(201).json(user);
    }
}

export { UserController }