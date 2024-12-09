import axios from "axios";
import { PREFIX_API_URL } from "./constant";

export const Login = (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    return axios.post(PREFIX_API_URL + '/api/v1/account/login', formData)
}

export const SignUp = (username, password, rePassword, nickname, dob, avatar) => {
    const signUpRequest = new FormData()
    signUpRequest.append('username', username)
    signUpRequest.append('password', password)
    signUpRequest.append('rePassword', rePassword)
    signUpRequest.append('nickname', nickname)
    signUpRequest.append('dob', dob)
    avatar !== null && signUpRequest.append('avatar', avatar)

    signUpRequest.forEach((value, key) => console.log(key + ": " + value))
    return axios.post(PREFIX_API_URL + '/api/v1/account/register', signUpRequest)
}

export const GetAllAccounts = () => {
    return axios.post(PREFIX_API_URL + '/api/v1/account/get-all-accounts')
}

export const GetAccountsByNickname = (nickname) => {
    return axios.post(PREFIX_API_URL + '/api/v1/account/find-accounts-by-nickname/' + nickname)
}