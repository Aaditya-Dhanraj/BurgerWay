import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-burgerway.firebaseio.com/",
});

export default instance;
