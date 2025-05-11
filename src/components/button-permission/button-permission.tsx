import { ButtonProps, ButtonTypeMap, ExtendButtonTypeMap } from '@mui/material';
import Button from '@mui/material/Button';
import { permission } from 'process';
import React, { useEffect, useState } from 'react'
import { UserPermission } from 'src/data/auth/role.model';
import TokenService, { getPermissions } from 'src/services/token.service';

type TButtonPermissionProps = {
    permission: UserPermission;
    label : string;
    props: any;
    };

export function ButtonDelete({ permission, label, props }: TButtonPermissionProps) {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
      const permissions = TokenService.getPermissions();
      const isShow = permissions.some(
        (p) => p.permission === permission && p.canDelete
      );
      setShow(isShow);
    }, [permission]);
    return (
      <>
        {!show ? (
          <></>
        ) : (
            <Button
            {...props}
            >
                {label}
            </Button>
    )}
  </>
    )
}

export function ButtonCreate({ permission, label, props }: TButtonPermissionProps) {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
      const permissions = TokenService.getPermissions();
      const isShow = permissions.some(
        (p) => p.permission === permission && p.canCreate
      );
      setShow(isShow);
    }, [permission]);
    return (
      <>
        {!show ? (
          <></>
        ) : (
                <Button
                {...props}
                >
                    {label}
                </Button>
        )}
      </>
        )
  }

  export function ButtonExport({ permission, label, props }: TButtonPermissionProps) {
    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
      const permissions = TokenService.getPermissions();
      const isShow = permissions.some(
        (p) => p.permission === permission && p.canExport
      );
      setShow(isShow);
    }, [permission]);
    return (
      <>
        {!show ? (
          <></>
        ) : (
                <Button
                {...props}
                >
                    {label}
                </Button>
        )}
      </>
        )
  }

  export function ButtonImport({ permission, label, props }: TButtonPermissionProps) {
    const [show, setShow] = useState<boolean>(false);
    useEffect(() => {
      const permissions = TokenService.getPermissions();
      const isShow = permissions.some(
        (p) => p.permission === permission && p.canImport
      );
      setShow(isShow);
    }, [permission]);
    return (
      <>
        {!show ? (
          <></>
        ) : (
                <Button
                {...props}
                >
                    {label}
                </Button>
        )}
      </>
        )
  }

  