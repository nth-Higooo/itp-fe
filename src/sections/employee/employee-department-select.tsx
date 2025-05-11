import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Department } from 'src/data/employer/department.model';

interface DepartmentSelectProps {
  name: string;
  departments: Department[];
  selectedDepartmentIds: string[];
  onChange: (selectedDepartmentIds: string[]) => void;
  disabled: boolean;
  placeholder?: string;
  label?: string;
  helperText?: any;
}

export function DepartmentSelect({
  label,
  departments,
  onChange,
  selectedDepartmentIds,
  placeholder,
  name,
  helperText,
  ...other
}: DepartmentSelectProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDepartments(selectedDepartmentIds);
  }, [selectedDepartmentIds]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value as string[];
    const newSelectedDepartments = new Set(value);

    // Include the parent if any child is selected
    departments.forEach((department) => {
      const hasSelectedChild = department.childrenDepartment?.some((child) =>
        newSelectedDepartments.has(child.id)
      );

      if (hasSelectedChild) {
        newSelectedDepartments.add(department.id);
      }
    });

    const updatedSelectedDepartments = Array.from(newSelectedDepartments);
    setSelectedDepartments(updatedSelectedDepartments);
    onChange(updatedSelectedDepartments);
  };

  const getDepartmentNameById = (id: string): string | undefined => {
    for (const department of departments) {
      if (department.id === id) {
        return department.name;
      }
      const child = department.childrenDepartment?.find((child) => child.id === id);
      if (child) {
        return child.name;
      }
    }
    return undefined;
  };

  const renderSelectedNamesAsChips = (selected: string[]) => {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {selected
          .map((id) => getDepartmentNameById(id))
          .filter((name): name is string => !!name)
          .map((name) => (
            <Chip key={name} label={name} size="small" />
          ))}
      </div>
    );
  };

  const menuItems = useMemo(() => {
    return departments.flatMap((department) => {
      const isParentSelected = selectedDepartments.includes(department.id);
      const parentItem = (
        <MenuItem key={department.id} value={department.id}>
          <Checkbox checked={isParentSelected} />
          <ListItemText primary={department.name} />
        </MenuItem>
      );

      const childItems = department.childrenDepartment?.map((child) => {
        const isChildSelected = selectedDepartments.includes(child.id);
        return (
          <MenuItem key={child.id} value={child.id} style={{ paddingLeft: '32px' }}>
            <Checkbox checked={isChildSelected} />
            <ListItemText primary={child.name} />
          </MenuItem>
        );
      });

      return [
        <ListSubheader key={`${department.id}-header`}>{department.name}</ListSubheader>,
        parentItem,
        ...(childItems || []),
      ];
    });
  }, [departments, selectedDepartments]);

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <InputLabel htmlFor={name}>{label}</InputLabel>}

          <Select
            label={label}
            placeholder={placeholder}
            multiple
            value={selectedDepartments}
            onChange={handleChange}
            renderValue={renderSelectedNamesAsChips}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {menuItems}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    ></Controller>
  );
}

export default DepartmentSelect;
