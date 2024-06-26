import React, {useState} from 'react';
import './App.css';

interface IData {
    name: string; 
    login?: string;
    public_repos?: number; 
    stargazers_count?: number; 
    type: string
}

interface FormProps {
  onResourceData: (data: IData) => void;
}

const Form = ({onResourceData}: FormProps) => {

  const [option, setOption] = useState<string>("user");
  const [name, setName] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setOption(e.target.value);
  };

  const getResource = async (type: string, name: string): Promise<IData> => {
    let url: string;
  
    switch (type) {
      case 'user':
        url = `https://api.github.com/users/${name}`;
        break;
      case 'repo':
        url = `https://api.github.com/repos/${name}`;
        break;
      default:
        throw new Error(`Ничего не найдено, перепроверьте данные: ${type}`);
    }
    
    let res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`По такому url ничего не найдено: ${url}, status: ${res.status}`);
    }

    return await res.json();

  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getResource(option, name)
      .then(res => {

        const data = res as IData;

        switch (option) {
          case 'user':
            onResourceData({
              name: data.name,
              login: data.login, 
              public_repos: data.public_repos, 
              type: option
            })
            break;
          case 'repo':
            onResourceData({
              name: data.name, 
              stargazers_count: data.stargazers_count, 
              type: option
            })
            break;
          default:
            return {};
        }
      })
      .catch(e => console.error('Произошла ошибка:', e))
  };

  return (
    <div className='form'>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" placeholder='Введите название' onInput={handleNameChange} />
          <select name="select" id="select" onChange={handleOptionChange}>
            <option value="user">user</option>
            <option value="repo">repo</option>
          </select>

          <button type="submit">отправить</button>
        </form>
    </div>
  )

}

const ResourceList = ({dataList}: {dataList: IData[]}) => {
  return (
    <ul className='list'>
      {dataList.map((data, i) => (
        <li key={i}>
          {data.name ? data.name : data.login}
          {data.type === 'user' ? <p>Количество репозиториев: {data.public_repos}</p> : <p>Число звезд: {data.stargazers_count}</p>}
        </li>
      ))}
    </ul>
  );
}

const App = () => {

  const [dataList, setDataList] = useState<IData[]>([]);

  const handleResourceData = (data: IData) => {
    setDataList(prevDataList => [
      ...prevDataList, 
      data
    ]);
  };

  return (
    <>
      <h2>Тестовое задание</h2>
      
      <Form onResourceData={handleResourceData} />      
      <ResourceList dataList={dataList} />
    </>
  );
}

export default App;
