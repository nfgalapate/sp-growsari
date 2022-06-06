const { default: mongoose } = require('mongoose');
const request = require('supertest');
const app = require('../app');

var token;
var tokenB;
beforeAll(done => { //register first a valid user and save token
    request(app)
        .post('/register')
        .send({
            "first_name": "name",
            "last_name": "lastname",
            "email": "a@gmail.com",
            "password": "passwordhere"
        })
        .end((err, response) => {
            token = response.body.token; //saving token for other tests.
            done()
        });
})

//registering user with complete details
describe('Register Endpoint Happy Path', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                "first_name": "name",
                "last_name": "lastname",
                "email": "b@gmail.com",
                "password": "passwordhere"
            })

        expect(res.body).toHaveProperty('token');
        expect(res.statusCode).toEqual(201);

    });
});

//registering user without input
describe('Register Endpoint Happy Path', () => {
    it('should register a user', async () => {
        const res = await request(app)
            .post('/register')
            .send({})

        expect(res.text).toEqual('All input is required');
        expect(res.statusCode).toEqual(400);

    });
});

//if user already exists (register endpoint)
describe('Register Endpoint if user already exists', () => {
    it('should return user already exists error', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                "first_name": "name",
                "last_name": "lastname",
                "email": "a@gmail.com",
                "password": "passwordhere"
            });

        expect(res.statusCode).toEqual(409); //conflict is expected bec user already exists
    });
});

//logging in with invalid credentials
describe('Logging in with invalid credentials', () => {
    it('should return an error that the credentials are invalid', async () => {
        const res = await request(app)
            .post('/login')
            .set('x-access-token', token)
            .send({                
                "email": "a@gmail.com",
                "password": "invalidpasswordhere"
            });
        expect(res.text).toEqual("Invalid Credentials");
        expect(res.statusCode).toEqual(400); //conflict is expected bec user already exists
    });
});

//accessing Welcome page w/o a token
describe('Welcome page w/o Token', () => {
    it('should require token', async () => {
        const res = await request(app)
            .get('/welcome');
        expect(res.statusCode).toEqual(403);
    });

});

//accessing Welcome page w/ a token
describe('Welcome page w/ Token', () => {
    it('should allow access with token', async () => {
        const res = await request(app)
            .get('/welcome')
            .set('x-access-token', token)
        expect(res.statusCode).toEqual(200);
    });

});

//getting all subjects from db
describe('GET Subjects', () => {
    it('should return status 200', async () => {
        const res = await request(app)
            .get('/subjects');
        expect(res.statusCode).toEqual(200);
    })
});

//adding a new subject to db with incomplete inputs
describe('POST subject with incomplete inputs', () => {
    it('should return an error that all inputs are required', async () => {
        const res = await request(app)
            .post('/subjects/add')
            .send({})
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("All inputs are required");
    })
});

//adding a new subject to db
describe('POST subject that does not exist yet', () => {
    it('should create a new subjet in the db', async () => {
        const res = await request(app)
            .post('/subjects/add')
            .send({
                "subject_name": "New Subject",
                "units": 3
            });
        expect(res.text).toEqual("Subject is added to DB");
        expect(res.statusCode).toEqual(200);
    })
});

//adding an existing subject to db
describe('POST subject that already exists', () => {
    it('should return an error', async () => {
        const res = await request(app)
            .post('/subjects/add')
            .send({
                "subject_name": "New Subject",
                "units": 3
            });
        expect(res.statusCode).toEqual(400);
    })
})



//getting a user's subjects without a token
describe('GET user subjects without a token', () => {
    it('should return a forbidden error', async () => {
        const res = await request(app)
            .get('/user/subjects');
        expect(res.statusCode).toEqual(403);

    });
});

//getting a user's subjects with a token
describe('GET user subjects with a token', () => {
    it('should return a forbidden error', async () => {
        const res = await request(app)
            .get('/user/subjects')
            .set('x-access-token', token)
        expect(res.statusCode).toEqual(200);

    });
});

//enrolling a subject without a token
describe('POST (enroll) subject without a token', () => {
    it('should return a forbidden error', async () => {
        const res = await request(app)
            .post('/user/enroll')
            .send({
                "subject_name": "New Subject"
            });
        expect(res.statusCode).toEqual(403);
    })
});

//enrolling a subject with a token
describe('POST (enroll) subject with a token', () => {
    it('should be able to enroll the subject', async () => {
        const res = await request(app)
            .post('/user/enroll')
            .set('x-access-token', token)
            .send({
                "subject_name": "New Subject"
            });

        expect(res.text).toEqual("Congratulations. You have successfully enrolled to New Subject");
        expect(res.statusCode).toEqual(200);
    });
});

//updating status of enrolled subject without token
describe('PATCH (update status) of enrolled subject without a token', () => {
    it('should be unable to update the enrolled subject', async () => {
        const res = await request(app)
            .patch('/user/subjects')
            .send({
                "subject_name": "New Subject",
                "s": "Completed"
            })
        expect(res.text).toEqual("A token is required for authentication");
        expect(res.statusCode).toEqual(403);
    });
});

//updating status of enrolled subject with a token
describe('PATCH (update status) of enrolled subject without a token', () => {
    it('should be unable to update the enrolled subject', async () => {
        const res = await request(app)
            .patch('/user/subjects')
            .set('x-access-token', token)
            .send({
                "subject_name": "New Subject",
                "s": "Completed"
            })
        expect(res.text).toEqual("Successfully updated New Subject to Completed");
        expect(res.statusCode).toEqual(200);
    });
});

//updating status of a non-existent subject
describe('PATCH (update status) of non-existent subject', () => {
    it('should return an error message that subject does not exist', async () => {
        const res = await request(app)
            .patch('/user/subjects')
            .set('x-access-token', token)
            .send({
                "subject_name": "New Subject 1",
                "s": "Completed"
            })
        expect(res.text).toEqual("There is no subject with name New Subject 1");
        expect(res.statusCode).toEqual(400);
    })
});

//updating status of enrolled subject with an empty body
describe('PATCH (update status) of non-existent subject', () => {
    it('should return an error message that subject does not exist', async () => {
        const res = await request(app)
            .patch('/user/subjects')
            .set('x-access-token', token)
            .send({})
        expect(res.text).toEqual("All fields are required");
        expect(res.statusCode).toEqual(400);
    })
});



//unenrolling a subject without a token
describe('PATCH (unenroll) subject without a token', () => {
    it('should be unable to unnroll the subject', async () => {
        const res = await request(app)
            .patch('/user/unenroll')
            .send({
                "subject_name": "New Subject"
            })
        expect(res.text).toEqual("A token is required for authentication");
        expect(res.statusCode).toEqual(403);
    });
});

//unenrolling a subject with a token
describe('PATCH (unenroll) subject with a token', () => {
    it('should be unable to unenroll the subject', async () => {
        const res = await request(app)
            .patch('/user/unenroll')
            .set('x-access-token', token)
            .send({
                "subject_name": "New Subject"
            })
        expect(res.text).toEqual("You have successfully unenrolled from: New Subject")
        expect(res.statusCode).toEqual(200);
    });
});

//unenrolling a subject that does not exist
describe('PATCH (unenroll) subject that does not exist', () => {
    it('should display error that subject does not exist', async () => {
        const res = await request(app)
            .patch('/user/unenroll')
            .set('x-access-token', token)
            .send({
                "subject_name": "New Subject 1"
            })
        expect(res.text).toEqual("Subject does not exist.");
        expect(res.statusCode).toEqual(400);
    });
});

//deleting a user without a token
describe('DELETE a user wihtout a token', () => {
    it('should return an error the token is required', async () => {
        const res = await request(app)
            .delete('/user/delete')
            .send({
                "email": "a@gmail.com"
            })
        expect(res.text).toEqual("A token is required for authentication")
        expect(res.statusCode).toEqual(403);
    });
});

//getting user's notes without a token
describe('GET users notes without a token', () => {
    it('should return a forbidden error', async () => {
        const res = await request(app)
            .get('/notes');
        expect(res.statusCode).toEqual(403);
        expect(res.text).toEqual("A token is required for authentication")

    });
});

//getting user's notes with a token
describe('GET users notes without a token', () => {
    it('should return a forbidden error', async () => {
        const res = await request(app)
            .get('/notes')
            .set('x-access-token', token);
        expect(res.statusCode).toEqual(200);
    });
});

//adding a new note without a token
describe('POST notes without a token', () => {
    it('should return an error that token is required for authentication', async () => {
        const res = await request(app)
            .post('/notes/add')
            .send({});
        expect(res.text).toEqual("A token is required for authentication")
        expect(res.statusCode).toEqual(403);
    });
});

//adding a new note with incomplete input
describe('POST notes with incomplete input', () => {
    it('should return an error that note title and content is required', async () => {
        const res = await request(app)
            .post('/notes/add')
            .set('x-access-token', token)
            .send({});
        expect(res.text).toEqual("Note title and content is required.")
        expect(res.statusCode).toEqual(400);
    });
});

//adding a new note with complete input
describe('POST notes with complete input', () => {
    it('should be able to successfully add a new note', async () => {
        const res = await request(app)
            .post('/notes/add')
            .set('x-access-token', token)
            .send({
                "note_title": "New Note 1",
                "content": "New content 1"
            });
        expect(res.text).toEqual("Note is added to DB")
        expect(res.statusCode).toEqual(200);
    });
});

//adding a duplicate note (same note title)
describe('POST a duplicate note', () => {
    it('should return an error that note title is already in use', async () => {
        const res = await request(app)
            .post('/notes/add')
            .set('x-access-token', token)
            .send({
                "note_title": "New Note 1",
                "content": "New content 1"
            });
        expect(res.text).toEqual("Note title is already in use.")
        expect(res.statusCode).toEqual(400);
    });
});

//updating a note without a token
describe('PATCH a note without a token', () => {
    it('should return an error that a token is required for authentication', async () => {
        const res = await request(app)
            .patch('/notes/update')
            .send({
                "note_title": "New Note 1",
                "content": "New content change 1"
            });
        expect(res.text).toEqual("A token is required for authentication")
        expect(res.statusCode).toEqual(403);
    });
});

//updating a note with a token
describe('PATCH a note with a token', () => {
    it('should be able to successfully update the token', async () => {
        const res = await request(app)
            .patch('/notes/update')
            .set('x-access-token', token)
            .send({
                "note_title": "New Note 1",
                "content": "New content change 1"
            });
        expect(res.text).toEqual("You have successfully updated New Note 1")
        expect(res.statusCode).toEqual(200);
    });
});

//updating a non-existent note with a token
describe('PATCH a non-existent note with a token', () => {
    it('should return an error that note does not exist', async () => {
        const res = await request(app)
            .patch('/notes/update')
            .set('x-access-token', token)
            .send({
                "note_title": "New Note 100",
                "content": "New content change 1"
            });
        expect(res.text).toEqual("There is no note entitled New Note 100")
        expect(res.statusCode).toEqual(400);
    });
});

//deleting note without a token
describe('DELETE note without a token', () => {
    it('should return an error that token is required for authentication', async () => {
        const res = await request(app)
            .delete('/notes/delete')
            .send({
                "note_title": "New Note 1"
            });
        expect(res.text).toEqual("A token is required for authentication")
        expect(res.statusCode).toEqual(403);
    });
});

//deleting note without an input
describe('DELETE note without an input', () => {
    it('should be able to delete the note', async () => {
        const res = await request(app)
            .delete('/notes/delete')
            .set('x-access-token', token)
            .send({});
        expect(res.text).toEqual("Please provide the note title you wish to delete.")
        expect(res.statusCode).toEqual(400);
    });
});

//deleting note with an input
describe('DELETE note with a token', () => {
    it('should be able to delete the note', async () => {
        const res = await request(app)
            .delete('/notes/delete')
            .set('x-access-token', token)
            .send({
                "note_title": "New Note 1"
            });
        expect(res.text).toEqual("You have successfully deleted New Note 1")
        expect(res.statusCode).toEqual(200);
    });
});

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}


afterAll(async () => {
    await removeAllCollections();
    mongoose.connection.close();

})