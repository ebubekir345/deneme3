import { Icon, LinkProps, PseudoBox, PseudoBoxProps, Text, TextProps } from '@oplog/express';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItemInterface {
  title: string;
  url?: string;
  isCurrentPage?: boolean;
  onClick?: () => void;
}

export type BreadcrumbItemProps = BreadcrumbItemInterface & LinkProps & TextProps;

export interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
  containerProps?: PseudoBoxProps;
  itemProps?: PseudoBoxProps;
  seperator?: string | React.ReactNode;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, containerProps, itemProps, seperator }: BreadcrumbProps) => {
  return (
    <PseudoBox as="nav" aria-label="breadcrumb" display="flex" fontSize="11" alignItems="center" {...containerProps}>
      {items.map(({ title, url, isCurrentPage, ...arrayProps }: BreadcrumbItemProps, index, arr) => {
        const isLink = url || arrayProps.onClick;
        const Item: any = url ? Link : Text;
        const isLastChild = arr.length - 1 === index;
        const baseLinkProps = { href: url, display: 'inline-flex', alignItems: 'center' };

        return (
          <Fragment key={title}>
            <Item
              aria-current={isCurrentPage ? 'page' : undefined}
              color={isLink ? 'text.link' : 'palette.grey'}
              cursor={isLink ? 'pointer' : 'unset'}
              lineHeight="normal"
              to={isLink ? url : undefined}
              {...baseLinkProps}
              {...itemProps}
              {...arrayProps}
            >
              {title}
            </Item>
            {!isLastChild &&
              (seperator || (
                <Icon color="palette.steel_dark" name="far fa-angle-right" mx="6" fontSize="13" lineHeight="normal" />
              ))}
          </Fragment>
        );
      })}
    </PseudoBox>
  );
};

export default Breadcrumb;
