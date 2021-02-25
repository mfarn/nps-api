import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Surveys", () => {
    beforeAll( async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Should be able to create a new survey", async() => {
        const response = await request(app).post('/surveys').send({
            title: 'Survey Title',
            description: "This is a example survey"
        });
    });


    it("Should be able to list all surveys", async() => {
        await request(app).post('/surveys').send({
            title: 'Survey Title 2',
            description: "This is a second example survey"
        });

        const response = await request(app).get('/surveys');

        expect(response.body.length).toBe(2);
    })

});