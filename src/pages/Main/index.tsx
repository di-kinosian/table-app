import React, { useEffect } from "react";
import styles from "./index.module.scss";
import { ITableColumn } from "../../components/Table";
import Table from "../../components/Table/Table";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { User } from "../../types";
import { fetchUsers, onChangeSearchBy, onSearch } from "../../redux/users";
import { Select } from "../../components/Select";
import { Input } from "../../components/Input";

const selectOptions = [
  { label: "name", value: "name" },
  { label: "username", value: "username" },
  { label: "number", value: "phone" },
  { label: "email", value: "email" },
];

const columns: ITableColumn<User>[] = [
  {
    key: "name",
    dataIndex: "name",
    title: "Name",
    width: "300px",
    sticky: true,
  },
  {
    key: "username",
    dataIndex: "username",
    title: "User Name",
    width: "200px",
  },
  {
    key: "phone",
    dataIndex: "phone",
    title: "Phone number",
    width: "300px",
  },
  {
    key: "email",
    dataIndex: "email",
    title: "Email",
    minWidth: "300px",
    width: 100,
  },
];

export const Main = () => {
  const dispatch = useAppDispatch();
  const { searchValue, searchBy, filteredUsers, error, loading } =
    useAppSelector((state) => state.users);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(onSearch(event.target.value));
  };

  const onSearchByChange = (value: string) => {
    dispatch(onChangeSearchBy(value));
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderContent}>
          <img src="https://smart-it.com/wp-content/uploads/2014/05/smart_transp.png" alt="SMART business" />
        </div>
      </div>
      <div className={styles.pageContent}>
        <div className={styles.pagePanel}>
          <Select
            options={selectOptions}
            placeholder="Serch by..."
            onChange={onSearchByChange}
            value={searchBy}
          />
          <Input
            placeholder="Search user"
            onChange={onSearchChange}
            value={searchValue}
          />
        </div>
        <div className={styles.pageTable}>
          <Table
            columns={columns}
            dataList={filteredUsers}
            rowKey="id"
            rowHeight={54}
            headerHeight={48}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};
