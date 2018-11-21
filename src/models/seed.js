const faker = require('faker');
const User = require('./user');

const execs = [
  { currentPosition: 'president' },
  { currentPosition: 'vice president' },
  { currentPosition: 'secretary' },
  { currentPosition: 'assistant secretary' },
  { currentPosition: 'financial secretary' },
  { currentPosition: 'welfare' },
  { currentPosition: 'welfare 2' },
  { currentPosition: 'provost' },
  { currentPosition: 'dos' },
  { currentPosition: 'dos 2' },
];

function seedDB() {
  execs.forEach((executive) => {
    const exec = { ...executive };
    exec.firstname = faker.name.firstName();
    exec.lastname = faker.name.lastName();
    exec.middlename = faker.name.firstName();
    exec.email = faker.internet.email();
    exec.image = faker.image.imageUrl();
    exec.username = exec.email;
    exec.isExecutive = true;
    exec.phone = faker.phone.phoneNumber();
    exec.dateOfBirth = faker.date.past();
    exec.gender = 'male';

    User.create(exec);
  });

  let num = 0;
  do {
    const member = {};
    member.firstname = faker.name.firstName();
    member.lastname = faker.name.lastName();
    member.middlename = faker.name.firstName();
    member.email = faker.internet.email();
    member.image = faker.image.imageUrl();
    member.username = member.email;
    member.phone = faker.phone.phoneNumber();
    member.dateOfBirth = faker.date.past();
    member.gender = 'male';

    User.create(member);
    num += 1;
  } while (num < 20);
}

module.exports = seedDB;
