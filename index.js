// implement your API here
const db = require('./data/db.js');
const express = require('express');
const server = express();


server.listen(4000, () => {
    console.log('=== server listening on port 4000 ===');
});

server.use(express.json());

server.get('/', (request, response) => {
    response.send('hello world...');
})


server.get('api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

server.get('api/users/:id', (req, res) => {
    const id = req.params.id;

    db.findById(id)
        .then(user => {
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
        })
        .catch(err => {
        res.status(500).json({error: "The user information could not be retrieved." });
        });
});

server.post('api/users', (req, res) => {
    const userInfo = req.body;

    if (!userInfo.name || !userInfo.bio) {
      res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." });
    } else {
      db.insert(userInfo)
        .then(user => {
          res.status(201).json({ success: true, user });
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the user to the database"
          });
        });
    }
  });

server.delete('api/users/:id', (req, res) => {
    const { id } = req.params.id;
    console.log('yeah');

    db.remove(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: `The user with the specified id=${id} does not exist.` });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed"  });
        });
});

server.put('api/users/:id', (req, res) => {
    const id = req.params.id;
    const userInfo = req.body;

    if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        db.update(id, userInfo)
          .then(user => {
            if (!user) {
              res.status(404).json({ message: `The user with the specified id=${id} does not exist.` });
            } else if (user) {
              db.findById(id)
                .then(newUser => {
                  res.status(200).json(newUser);
                })
                .catch(err => {
                  res.status(500).json({ error: "The user information could not be modified." });
                });
            }
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: "The user information could not be modified." });
          });
      }
    });




