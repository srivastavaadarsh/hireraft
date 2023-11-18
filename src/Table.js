import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const TableAssignment = () => {

    //Table data, there will be 3 column in table. 1-Name, 2-Age, 3-Country
    const initialData = [
      { name: "John Doe", age: 25, country: "USA" },
      { name: "Jane Doe", age: 30, country: "Canada" },
      { name: "Bob Smith", age: 22, country: "UK" },
      { name: "John Doe", age: 25, country: "USA" },
      { name: "Jane Doe", age: 30, country: "Canada" },
      { name: "Bob Smith", age: 22, country: "UK" },
      { name: "John Doe", age: 25, country: "USA" },
      { name: "Jane Doe", age: 30, country: "Canada" },
      { name: "Bob Smith", age: 22, country: "UK" },
    ];
  
    //defining state variable for different features
    const [data, setData] = useState(initialData);
    const [sortBy, setSortBy] = useState({ key: null, ascending: true });
    const [filter, setFilter] = useState("");
    const [searchColumn, setSearchColumn] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [columns, setColumns] = useState([
      { id: "name", label: "Name", isVisible: true },
      { id: "age", label: "Age", isVisible: true },
      { id: "country", label: "Country", isVisible: true },
    ]);
    const [draggedIndex, setDraggedIndex] = useState(null);
  
    // Event handler for sorting columns
    const handleSort = (key) => {
      setSortBy((prevSortBy) => ({
        key,
        ascending: prevSortBy.key === key ? !prevSortBy.ascending : true,
      }));
    };
  
    // Event handler for filtering data
    const handleFilterChange = (e) => {
      setFilter(e.target.value);
      setCurrentPage(1);
    };
  
    // Event handler for searching within a specific column
    const handleColumnSearch = (columnId, value) => {
      setSearchColumn(columnId);
      setFilter(value);
    };
  
    // Event handler for clearing search filters
    const handleSearch = () => {
      setSearchColumn("");
      setFilter("");
    };
  
    // Event handler for changing the current page
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    // Event handler for toggling column visibility
    const toggleColumn = (columnId) => {
      setColumns((prevColumns) => {
        const updatedColumns = prevColumns.map((column) => {
          if (column.id === columnId) {
            return { ...column, isVisible: !column.isVisible };
          } else {
            return column;
          }
        });
  
        return updatedColumns;
      });
    };
  
    // Event handler for starting column drag
    const handleDragStart = (index) => {
      setDraggedIndex(index);
    };
  
    // Event handler for dragging over columns
    const handleDragOver = (index) => {
      if (draggedIndex !== null) {
        const updatedColumns = [...columns];
        const draggedColumn = updatedColumns.splice(draggedIndex, 1)[0];
        updatedColumns.splice(index, 0, draggedColumn);
        setColumns(updatedColumns);
        setDraggedIndex(index);
      }
    };
    // Event handler for ending column drag
    const handleDragEnd = () => {
      setDraggedIndex(null);
    };
  
    // Memoized data for sorting, filtering, and pagination
    const sortedData = useMemo(() => {
      if (sortBy.key) {
        const sorted = [...data].sort((a, b) => {
          if (a[sortBy.key] < b[sortBy.key]) return sortBy.ascending ? -1 : 1;
          if (a[sortBy.key] > b[sortBy.key]) return sortBy.ascending ? 1 : -1;
          return 0;
        });
        return sorted;
      }
      return data;
    }, [data, sortBy]);
  
    // Memoized data for filtering based on the global search input
    const filteredData = useMemo(() => {
      // If the global filter is empty, return the sorted data as it is
      if (filter.trim() === "") {
        return sortedData;
      }
  
      // Filter the sorted data based on whether any value in each row
      // includes the lowercase version of the global filter string
      return sortedData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }, [sortedData, filter]);
  
    // Memoized data for filtering based on the column-specific search input
    const columnFilteredData = useMemo(() => {
      // If the column-specific or global filter is empty, return the previously filtered data
  
      if (searchColumn.trim() === "" || filter.trim() === "") {
        return filteredData;
      }
  
      // Filter the previously filtered data based on whether the value in the specified column
      // includes the lowercase version of the global filter string
      return filteredData.filter((row) =>
        String(row[searchColumn]).toLowerCase().includes(filter.toLowerCase())
      );
    }, [filteredData, searchColumn, filter]);
  
    // Define the number of items to display per page
    const itemsPerPage = 4;
  
    // Memoized data for paginating the column-filtered data
    const paginatedData = useMemo(() => {
      // Calculate the start and end index for the current page
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
  
      // Return the slice of data to display on the current page
      return columnFilteredData.slice(startIndex, endIndex);
    }, [columnFilteredData, currentPage]);
  
    // Calculate the total number of pages based on the number of items per page
    const totalPages = Math.ceil(columnFilteredData.length / itemsPerPage);
  
    return (
      <div>
        {/* Search input for global filtering */}
        <TextField
          variant="outlined"
          size="small"
          placeholder={`Search ${filteredData.length} records...`}
          value={filter}
          onChange={handleFilterChange}
        />
  
        {/* Search inputs for individual column filtering */}
        {columns.map((column, index) => (
          <TextField
            key={column.id}
            variant="outlined"
            size="small"
            placeholder={`Search in ${column.label}...`}
            value={searchColumn === column.id ? filter : ""}
            onChange={(e) => handleColumnSearch(column.id, e.target.value)}
          />
        ))}
  
        {/* Button to trigger the search */}
        <Button onClick={() => handleSearch()}>Search</Button>
  
        {/* Column visibility toggles */}
        <div>
          {columns.map((column, index) => (
            <div key={column.id} style={{ display: "inline-block" }}>
              <Tooltip title={column.isVisible ? "Hide Column" : "Show Column"}>
                <IconButton onClick={() => toggleColumn(column.id)}>
                  {column.isVisible ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </Tooltip>
  
              {/* Drag-and-drop handles for column reordering */}
              <Button
                style={{ cursor: "move", display: "inline-block" }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={() => handleDragOver(index)}
                onDragEnd={handleDragEnd}
              >
                {column.label}{" "}
              </Button>
              {index > 0 && <span style={{ marginLeft: "5px" }}></span>}
            </div>
          ))}
        </div>
  
  
        {/* Table component for displaying data */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {columns
                  .filter((column) => column.isVisible)
                  .map((column) => (
                    <TableCell key={column.id}>
                      <Button onClick={() => handleSort(column.id)}>
                        Sort {column.label}{" "}
                        {sortBy.key === column.id &&
                          (sortBy.ascending ? "🔼" : "🔽")}
                      </Button>
                    </TableCell>
                  ))}
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                {columns
                  .filter((column) => column.isVisible)
                  .map((column) => (
                    <TableCell key={column.id}>
                     
                        {column.label}{" "}
                        
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell></TableCell>
  
                  {/* Table headers for visible columns */}
                  {columns
                    .filter((column) => column.isVisible)
                    .map((column) => (
                      <TableCell key={column.id}>{row[column.id]}</TableCell>
                    ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        {/* Pagination controls */}
        <div>
          {/* Button for navigating to the previous page */}
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {/* Display current page and total pages */}
          <span>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          {/* Button for navigating to the next page */}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };
  
  export default TableAssignment;