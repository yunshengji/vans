import request from '@/utils/request';

export async function Login(data) {
  return request('/login', {
    method: 'POST',
    data,
  });
}

export async function GetValidateCode(data) {
  return request('/forget_password', {
    method: 'POST',
    data,
  });
}

export async function ChangePassword(data) {
  return request('/verify_code', {
    method: 'PUT',
    data,
  });
}

export async function GetDepartments(params) {
  return request('/department', {
    method: 'GET',
    params,
  });
}

export async function CreateUser(data) {
  return request('/user', {
    method: 'POST',
    data,
  });
}

export async function EditUser(id, data) {
  return request(`/user/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function GetUsersList(params) {
  return request('/user', {
    method: 'GET',
    params,
  });
}

export async function GetMe() {
  return request('/user/me', {
    method: 'GET',
  });
}
