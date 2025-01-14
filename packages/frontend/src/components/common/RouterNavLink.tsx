import { NavLink, NavLinkProps } from '@mantine/core';
import { FC } from 'react';
import {
    NavLink as ReactRouterNavLink,
    NavLinkProps as ReactRouterNavLinkProps,
    useRouteMatch,
} from 'react-router-dom';

type RouterNavLinkProps = Omit<NavLinkProps, 'component' | 'active'> &
    Omit<ReactRouterNavLinkProps, 'component'>;

const RouterNavLink: FC<RouterNavLinkProps> = (props) => {
    const match = useRouteMatch(props.to.toString());

    return (
        <NavLink
            {...props}
            component={ReactRouterNavLink}
            active={
                match
                    ? props.exact
                        ? props.exact === match.isExact
                        : true
                    : false
            }
        />
    );
};

export default RouterNavLink;
