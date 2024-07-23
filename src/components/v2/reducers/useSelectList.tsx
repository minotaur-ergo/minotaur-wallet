import { useEffect, useMemo, useState } from 'react';
import { SelectableType } from '../models';
import { IconButton } from '@mui/material';
import { Checklist } from '@mui/icons-material';

interface OutputType<T> {
  list: (T & SelectableType)[];
  selectedCount: number;
  totalCount: number;
  handleSelectAll: () => void;
  handleToggle: (id: string | number, checked: boolean) => void;
  SelectAllButton: () => JSX.Element;
}

function useSelectList<T>(
  getData: () => Promise<(T & SelectableType)[]>,
  pk: keyof T
): OutputType<T> {
  const [list, setList] = useState<(T & SelectableType)[]>([]);

  const totalCount = useMemo(() => list.length, [list]);
  const selectedCount = useMemo(
    () => list.filter(({ selected }) => selected).length,
    [list]
  );

  const handleSelectAll = () => {
    const newList = [...list];
    newList.forEach((item) => {
      item.selected = selectedCount !== totalCount;
    });
    setList(newList);
  };

  const handleToggle = (id: string | number, checked: boolean) => {
    const newList = [...list];
    const index = newList.findIndex((item) => id === item[pk]);
    if (index > -1) {
      newList[index].selected = checked;
    }
    setList(newList);
  };

  const SelectAllButton = () => {
    return (
      <IconButton
        color={selectedCount < totalCount ? 'default' : 'primary'}
        onClick={handleSelectAll}
      >
        <Checklist />
      </IconButton>
    );
  };

  useEffect(() => {
    getData().then((data) => setList(data));
  }, []);

  return {
    list,
    selectedCount,
    totalCount,
    handleSelectAll,
    handleToggle,
    SelectAllButton,
  };
}

export default useSelectList;
