const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, rejected) => {
    fs.readFile(file, (err, data) => {
      if (err) rejected(err.message);
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject(err.message);
      resolve("Success");
    });
  });
};

const getDogPicture = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    await writeFilePromise("dog-img.txt", res.body.message);
    console.log("File written");
  } catch (error) {
    console.log(error);
    throw error;
  }
  return "2: Ready";
};

console.log("1");

(async () => {
  try {
    const data = await getDogPicture();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
})();

// getDogPicture()
//   .then((data) => {
//     console.log(data);
//     console.log("1");
//   })
//   .catch((er) => {
//     console.log(er);
//   });

// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePromise("dog-img.txt", res.body.message);
//   })
//   .then(() => {
//     console.log("file written");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
