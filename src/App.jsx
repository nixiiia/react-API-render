import React from 'react';
import './App.scss';

import Items from './components/Items';
import Pagination from './components/Pagination';

import axios from 'axios';
import md5 from 'md5';

function App() {
  const [items, setItems] = React.useState([]);
  const [totalItems, setTotalItems] = React.useState([]);
  const [ids, setIds] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(50);

  const getCurrentDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}${month}${day}`;

    return formattedDate;
  };

  const pass = ['Valantis_'];

  const getItems = pass + getCurrentDate();

  const hash = md5(getItems);

  const limit = 50;

  React.useEffect(() => {
    try {
      axios({
        method: 'post',
        url: 'https://api.valantis.store:41000',
        headers: { 'X-Auth': hash, 'Content-Type': 'application/json' },
        data: {
          action: 'get_ids',
        },
      }).then(({ data }) => {
        setTotalItems(data.result);
      });
    } catch (error) {
      alert('Ошибка при запросе данных :(');
      console.error(error);
    }
  }, [hash]);

  React.useEffect(() => {
    try {
      axios({
        method: 'post',
        url: 'https://api.valantis.store:41000',
        headers: { 'X-Auth': hash, 'Content-Type': 'application/json' },
        data: {
          action: 'get_ids',
          params: {
            limit: 50,
            offset: (currentPage - 1) * limit,
          },
        },
      }).then(({ data }) => {
        setIds(data.result);
      });

      axios({
        method: 'post',
        url: 'https://api.valantis.store:41000',
        headers: { 'X-Auth': hash, 'Content-Type': 'application/json' },
        data: {
          action: 'get_items',
          params: { ids: ids },
        },
      }).then(({ data }) => {
        setItems(data.result);
      });
    } catch (error) {
      alert('Ошибка при запросе данных :(');
      console.error(error);
    }
  }, [hash, currentPage, ids]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="App">
      <Items items={items} />

      <Pagination itemsPerPage={itemsPerPage} totalItems={totalItems.length} paginate={paginate} />

      <button disabled={currentPage === 1} onClick={prevPage}>
        Prev Page
      </button>
      <button onClick={nextPage}>Next Page</button>
    </div>
  );
}

export default App;
