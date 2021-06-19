const isEmpty = require("lodash.isempty");
const get = require("lodash.get");
const httpStatus = require("http-status");
const firebaseAdmin = require("firebase-admin");
const {v4: uuidv4} = require("uuid");

const isLocal = isEmpty(process.env.GAE_APPLICATION);

let DOMAIN_NAME = "gds-interview.et.r.appspot.com";
let PROTOCOL = "http";
if (isLocal) {
  DOMAIN_NAME = "localhost:8080";
  PROTOCOL = "http";
}

// adapted URL regex from https://regexr.com/37i6s
// eslint-disable-next-line max-len
const URL_REGEX = /(https?:\/\/)?(www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))/;
const HOST_GROUP_INDEX = 3;

firebaseAdmin.initializeApp();
const db = firebaseAdmin.firestore();
const shortenedUrlsCollection = db.collection("shortenedUrls");

const validateUrl = (url) => {
  return URL_REGEX.test(url);
};

const sanitizeUrl = (url) => {
  const groups = url.match(URL_REGEX);
  const host = groups[HOST_GROUP_INDEX];
  return `www.${host}`;
};

const lookupSlug = async (slug) => {
  const urlDoc = await shortenedUrlsCollection.doc(slug).get();
  if (!urlDoc.exists) {
    return;
  }
  return get(urlDoc.data(), "longUrl");
};

const redirectToLongUrl = async (req, res) => {
  try {
    const slug = get(req.params, "slug");
    const slugIsValid = !isEmpty(slug) && slug.length === 6;
    if (!slugIsValid) {
      return res.status(httpStatus.BAD_REQUEST)
          .send("Not a valid shortened URL.");
    }
    const longUrl = await lookupSlug(slug);
    if (!longUrl) {
      return res.status(httpStatus.BAD_REQUEST)
          .send("Shortened URL not found.");
    }
    return res.redirect(`//${longUrl}`);
  } catch (error) {
    console.error(error);
    const errorMessage = "Unexpected Internal Server " +
      "Error encountered. Please try again later.";
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({message: errorMessage});
  }
};

const createSlug = async (req, res) => {
  try {
    let longUrl = get(req.body, "longUrl");
    if (!validateUrl(longUrl)) {
      return res.status(httpStatus.BAD_REQUEST).send("URL is invalid");
    }
    longUrl = sanitizeUrl(longUrl);

    const existingLongUrlDoc = await shortenedUrlsCollection
        .where("longUrl", "==", longUrl).get();
    if (!existingLongUrlDoc.empty) {
      const slug = get(existingLongUrlDoc.docs[0].data(), "slug");
      const successMessage = `${PROTOCOL}://www.${DOMAIN_NAME}/${slug}`;
      return res.status(httpStatus.OK)
          .send(successMessage);
    }

    // first six characters of UUID sufficient
    const slug = uuidv4().substring(0, 6);
    await shortenedUrlsCollection.doc(slug).set({longUrl, slug}, {merge: true});
    const successMessage = `${PROTOCOL}://www.${DOMAIN_NAME}/${slug}`;
    return res.status(httpStatus.OK).send(successMessage);
  } catch (error) {
    console.error(error);
    const errorMessage = "Unexpected Internal Server Error " +
    "encountered. Please try again later.";
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .send({message: errorMessage});
  }
};

module.exports = {
  createSlug,
  redirectToLongUrl,
};
