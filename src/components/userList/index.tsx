import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';



interface NewUserInput {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
}

interface UserDetails {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  is_active: boolean;
}

interface ValidationErrors {
  username?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
}

const saveState = (state:any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('usersListState', serializedState);
    localStorage.setItem('authToken', state.authToken);
  } catch (e) {
    console.error(e)
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('usersListState');
    const authToken = localStorage.getItem('authToken');
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    if (authToken) {
      state.authToken = authToken;
    }
    return state;
  } catch (e) {
    return undefined;
  }
};


const UsersList = ({ authToken }: { authToken: string }) => {
  const [users, setUsers] = useState<UserDetails[]>(() => {
    const persistedState = loadState();
    return persistedState?.users || [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserDetails | null>(null);
  const [userDetails, setUserDetails] = useState<UserUpdateData>({});
  interface UserUpdateData extends Partial<UserDetails> {}
  const navigate = useNavigate()

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  
  useEffect(() => {
    saveState({ users });
  }, [users]);

  const handleUserDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  field: keyof UserDetails) => {
    setUserDetails((prevState) => ({
      ...prevState,
      [field]: e.target.value,
    } as UserDetails));
  };

  const [isAddingUser, setIsAddingUser] = useState(false);

  const updateUsersList = (updatedUser: UserDetails) => {
    const updatedUsers = users.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
  };

  const addUserToList = (newUser: UserDetails) => {
    setUsers(prevUsers => [...prevUsers, newUser]);
  };


  const validateNewUser = (newUser: NewUserInput) => {
    let errors: ValidationErrors = {};
    let formIsValid = true;
  
    if (!newUser.username) {
      errors.username = "Поле 'Логин' не может быть пустым.";
      formIsValid = false;
    } else if (!/[\w.@+-]+/.test(newUser.username) || newUser.username.length > 150) {
      errors.username = "Логин недействителен или слишком длинный.";
      formIsValid = false;
    }
    
    if (newUser.first_name && newUser.first_name.length > 150) {
      errors.first_name = "Имя не может быть длиннее 150 символов.";
      formIsValid = false;
    }
    
    if (newUser.last_name && newUser.last_name.length > 150) {
      errors.last_name = "Фамилия не может быть длиннее 150 символов.";
      formIsValid = false;
    }
    
    if (newUser.password) {
      if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(newUser.password)) {
        errors.password = "Пароль должен быть не менее 8 символов, включая одну заглавную букву и цифру.";
        formIsValid = false;
      } else if (newUser.password.length > 128) {
        errors.password = "Пароль не может быть длиннее 128 символов.";
        formIsValid = false;
      }
    } else {
      errors.password = "Поле 'Пароль' не может быть пустым.";
      formIsValid = false;
    }
    
    return { formIsValid, errors };
  };
  

  const logout = () => {
    
    localStorage.clear();
    navigate('/login')
    authToken=''
};
  

  const validateUserDetails = () => {
    let errors: ValidationErrors = {};
    let formIsValid = true;
  
    if (!userDetails.username || !/[\w.@+-]+/.test(userDetails.username) || userDetails.username.length > 150) {
      errors.username = "Недопустимый логин.";
      formIsValid = false;
    }
  
    if (userDetails.first_name && userDetails.first_name.length > 150) {
      errors.first_name = "Имя не может превышать 150 символов.";
      formIsValid = false;
    }
  
    if (userDetails.last_name && userDetails.last_name.length > 150) {
      errors.last_name = "Фамилия не может превышать 150 символов.";
      formIsValid = false;
    }
  
    if (userDetails.password && (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(userDetails.password) || userDetails.password.length > 128)) {
      errors.password = "Пароль должен содержать минимум 8 символов, включая буквы и цифры, и не превышать 128 символов.";
      formIsValid = false;
    }
  
    setValidationErrors(errors);
  
    if (!formIsValid) {
      let errorMessage = 'Обнаружены следующие ошибки валидации:\n';
      Object.values(errors).forEach(error => {
        errorMessage += `${error}\n`;
      });
      alert(errorMessage);
    }
  
    return formIsValid;
  };
  
  const saveUserDetails = async () => {
    if (!selectedUserForEdit) {
      console.error('Не выбран пользователь');
      return;
    }

    if (!validateUserDetails()) {
      alert("Недопустимый формат")
      console.error('Ошибка валидации');
      
      return;
    }
  
    const allFieldsChanged = Object.keys(userDetails).length === Object.keys(selectedUserForEdit).length;
    const method = allFieldsChanged ? 'put' : 'patch';
    const url = `https://test-assignment.emphasoft.com/api/v1/users/${selectedUserForEdit.id}/`;
  
    try {
      const response = await axios[method](url, userDetails, {
        headers: { Authorization: `Token ${authToken}` },
      });
      updateUsersList(response.data)
      setUserDetails({});
  

      setSelectedUserForEdit(null);
  
      console.log('User details updated', response.data);
    } catch (error) {
      console.error('Error updating user details', error);
    }
  };

  const fetchUserDataById = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://test-assignment.emphasoft.com/api/v1/users/${userId}`, {
        headers: { Authorization: `Token ${authToken}` },
      });
      setSelectedUserForEdit(response.data);
      setUserDetails(response.data);
      setError('');
    } catch (error) {
      setError('Произошла ошибка при получении данных пользователя.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }; 

  const [newUserData, setNewUserData] = useState<NewUserInput>({
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    is_active: true,
  });  

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://test-assignment.emphasoft.com/api/v1/users/', {
          headers: { Authorization: `Token ${authToken}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Произошла ошибка при получении списка пользователей.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (authToken) {
      fetchUsers();
    }
  }, [authToken]);

  const sortUsers = (users: UserDetails[], direction: string) => {
    return [...users].sort((a, b) => {
      return direction === 'asc' ? a.id - b.id : b.id - a.id;
    });
  };

  const handleEditUserClick = (user: UserDetails) => {
    if (isAddingUser) {
      setIsAddingUser(false);
    }
    if (selectedUserForEdit && selectedUserForEdit.id === user.id) {
      setSelectedUserForEdit(null);
      setUserDetails({});
    } else {
      setSelectedUserForEdit(user);
      fetchUserDataById(user.id);
    }
  };

  const handleAddUserClick = () => {
    setSelectedUserForEdit(null);
    setUserDetails({});
    setIsAddingUser(!isAddingUser);
  };

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setUsers(currentUsers => sortUsers(currentUsers, sortDirection));
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCreateUser = async () => {
    const validation = validateNewUser(newUserData);
    
    if (!validation.formIsValid) {
      setValidationErrors(validation.errors);
      alert("Пожалуйста, исправьте ошибки в форме.");
      return;
    }
  
    try {
      const response = await axios.post('https://test-assignment.emphasoft.com/api/v1/users/', newUserData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
      });
  
      setUsers(prevUsers => [...prevUsers, response.data]);
      setNewUserData({ username: '', first_name: '', last_name: '', password: '', is_active: true });
      setIsAddingUser(false);
      setValidationErrors({});
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError('Ошибка: ' + error.response.data.detail || 'Ошибка при создании пользователя.');
      } else {
        setError('Неизвестная ошибка');
      }
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="users-list">
    <h1>Список пользователей</h1>
    <TextField fullWidth={true} margin='normal' variant='outlined' placeholder="Фильтр по логину" onChange={e => setFilter(e.target.value)}/>
    <Button onClick={handleSortClick}>Sort by ID {sortDirection === 'asc' ? '↓' : '↑'}</Button>

    <Button startIcon={<AddIcon />} onClick={handleAddUserClick}>
          Добавить пользователя
      </Button>

      <Button onClick={logout}>
        Выйти из аккаунта
      </Button>

      {selectedUserForEdit && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Логин"
            value={userDetails.username ?? selectedUserForEdit.username}
            onChange={(e) => handleUserDetailChange(e, 'username')}
            
            error={!!validationErrors.username}
            helperText={validationErrors.username || ''}
          />
          <TextField
            label="Имя"
            value={userDetails.first_name ?? selectedUserForEdit.first_name}
            onChange={(e) => handleUserDetailChange(e, 'first_name')}
            error={!!validationErrors.first_name}
            helperText={validationErrors.first_name || ''}
          />
          
          <TextField
            label="Фамилия"
            value={userDetails.last_name ?? selectedUserForEdit.last_name}
            onChange={(e) => handleUserDetailChange(e, 'last_name')}
            error={!!validationErrors.last_name}
            helperText={validationErrors.last_name || ''}
      
          />
          <TextField
            label="Пароль"
            type='password'
            value={userDetails.password ?? selectedUserForEdit.password}
            onChange={(e) => handleUserDetailChange(e, 'password')}
            error={!!validationErrors.password}
            helperText={validationErrors.password || ''}
          />
          <Button variant="contained" onClick={saveUserDetails}>Сохранить</Button>
        </Box>
      )}      

      {isAddingUser && (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Логин"            
            onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
          />
          <TextField
            label="Имя"
            value={newUserData.first_name}
            onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
          />
          <TextField
            label="Фамилия"
            value={newUserData.last_name}
            onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
          />
          <TextField
            label="Пароль"
            type="password"
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          />
          <Button variant="contained" onClick={handleCreateUser}>
            Создать
          </Button>
        </Box>
      )}

  <ul style={{ padding: 0 }}>
    <li className="user-item header">
      <span className="user-id">ID</span>
      <span className="user-name">Имя</span>
      <span className="user-username">Логин</span>
    </li>
    {filteredUsers.map(user => (
      <li className="user-item" key={user.id}>
        <span className="user-id">{user.id}</span>
        <span className="user-name">{user.first_name} {user.last_name}</span>
        <span className="user-username">{user.username}</span>
        <Button onClick={() => handleEditUserClick(user)}>Настройка</Button>
      </li>
    ))}
  </ul>

</div>

  );
};

export default UsersList;
