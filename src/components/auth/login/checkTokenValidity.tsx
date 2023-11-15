import axios from 'axios';

const checkTokenValidity = async (token: string) => {
  try {

    const response = await axios.get('https://test-assignment.emphasoft.com/api/v1/users/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return true;
  } catch (error) {

    return false;
  }
};

export default checkTokenValidity;