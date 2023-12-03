import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const itemsPerPage = 10;
  const url = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const fetchData = () => {
    return axios.get(url).then((res) => setData(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteSelected = () => {
    const newData = data.filter((dataObj) => !selectedRows.includes(dataObj.id));
    setData(newData);
    setSelectedRows([]);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((dataObj) => dataObj.id !== id));
  };


  const handleEdit = (id) => {
    setEditId(id);
  };

  const handleSave = (id) => {
    const newName = document.getElementById(`name-${id}`).value;
    const newEmail = document.getElementById(`email-${id}`).value;
    const newRole = document.getElementById(`role-${id}`).value;

    setData((prevData) =>
      prevData.map((dataObj) =>
        dataObj.id === id ? { ...dataObj, name: newName, email: newEmail, role: newRole } : dataObj
      )
    );

    setEditId(null);
  };

  const handleSearch = (e) => {
    const x = document.getElementById('search');
    // setSearchTerm(e.target.value);
    setSearchTerm(x.value);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const toggleSelectAll = () => {
    const allIdsOnPage = currentItems.map((dataObj) => dataObj.id);
    const allSelected = selectedRows.length === allIdsOnPage.length;

    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allIdsOnPage);
    }
  };

  const handleSelectRow = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const filteredData = data.filter((dataObj) => {
    return (
      dataObj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataObj.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataObj.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) > 1 ? Math.ceil(filteredData.length / itemsPerPage) : 1;

  return (
    <div className="App">
      <div className="search-container">
        <input type="text" id="search" placeholder='Enter Value...' />
        <button onClick={() => handleSearch()}>Search</button>
        <button onClick={handleDeleteSelected} disabled={selectedRows.length === 0} className="icon-button">
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={toggleSelectAll} checked={selectedRows.length === currentItems.length && selectedRows.length > 0} />
            </th>
            <th>name</th>
            <th>email</th>
            <th>role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((dataObj) => (
            <tr
              key={dataObj.id}
              className={` ${selectedRows.includes(dataObj.id) ? 'selected-row' : ''}`}
            >
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleSelectRow(dataObj.id)}
                  checked={selectedRows.includes(dataObj.id)}
                />
              </td>
              <td>
                {editId === dataObj.id ? (
                  <input type="text" defaultValue={dataObj.name} id={`name-${dataObj.id}`} />
                ) : (
                  dataObj.name
                )}
              </td>
              <td>
                {editId === dataObj.id ? (
                  <input type="text" defaultValue={dataObj.email} id={`email-${dataObj.id}`} />
                ) : (
                  dataObj.email
                )}
              </td>
              <td>
                {editId === dataObj.id ? (
                  <input type="text" defaultValue={dataObj.role} id={`role-${dataObj.id}`} />
                ) : (
                  dataObj.role
                )}
              </td>
              <td>
                {editId === dataObj.id ? (
                  <button onClick={() => handleSave(dataObj.id)}>
                    <i className="fas fa-save"></i>
                  </button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(dataObj.id)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDelete(dataObj.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-container">
        <button onClick={() => handlePageChange(1)}><i className="fas fa-step-backward"></i></button>
        <button onClick={() => handlePageChange(currentPage - 1)}><i className="fas fa-chevron-left"></i></button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={() => handlePageChange(currentPage + 1)}><i className="fas fa-chevron-right"></i></button>
        <button onClick={() => handlePageChange(totalPages)}><i className="fas fa-step-forward"></i></button>

      </div>

    </div>
  );
}

export default App;
