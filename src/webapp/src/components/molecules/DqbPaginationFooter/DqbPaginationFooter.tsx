import { Pagination } from 'dynamic-query-builder-client';
import * as React from 'react';
import { Flex, Icon, PseudoBox, PseudoBoxProps, Text } from '@oplog/express';
import { buildDataGridFooterTranslations } from '@oplog/data-grid';
import { injectIntl } from 'react-intl';
import { Props } from '../../atoms/Component/Component';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

export interface IFooterPagination {
  pageCount: number;
  rowCount: number;
  pagination: Pagination;
}

export interface IDqbPaginationFooter extends Props {
  pageNeighbours?: number;
  footerPagination: IFooterPagination;
  handlePageNumberChange: any;
}

export const range = (from: number, to: number, step = 1) => {
  let i = from;
  const rangeArray = [] as any;

  while (i <= to) {
    rangeArray.push(i);
    i += step;
  }

  return rangeArray;
};

export const fetchPageNumbers = (totalPages: number, pageNeighbours: number, currentPage: number) => {
  const totalNumbers = pageNeighbours * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalPages > totalBlocks) {
    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

    let pages = range(startPage, endPage);

    const hasLeftSpill = startPage > 2;
    const hasRightSpill = totalPages - endPage > 1;
    const spillOffset = totalNumbers - (pages.length + 1);

    switch (true) {
      case hasLeftSpill && !hasRightSpill: {
        const extraPages = range(startPage - spillOffset, startPage - 1);
        pages = [LEFT_PAGE, ...extraPages, ...pages];
        break;
      }

      case !hasLeftSpill && hasRightSpill: {
        const extraPages = range(endPage + 1, endPage + spillOffset);
        pages = [...pages, ...extraPages, RIGHT_PAGE];
        break;
      }

      case hasLeftSpill && hasRightSpill:
      default: {
        pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
        break;
      }
    }

    return [1, ...pages, totalPages];
  }

  return range(1, totalPages);
};

const commonButtonProps = {
  as: 'button',
  mx: '6',
  size: 'small',
  width: 30,
  height: 30,
  bg: 'transparent',
  p: 0,
  borderRadius: 'sm',
  border: 'xs',
  borderColor: 'palette.grey_lighter',
  color: 'palette.grey',
  _hover: { borderColor: 'palette.grey_dark' },
  _disabled: { borderColor: 'palette.snow', color: 'palette.snow', cursor: 'not-allowed' },
  _focus: { outline: 'none' },
} as PseudoBoxProps;

export const DqbPaginationFooter: React.FC<IDqbPaginationFooter> = ({
  intl,
  pageNeighbours = 1,
  footerPagination,
  handlePageNumberChange,
}) => {
  if (footerPagination.pageCount === 1) return null;

  const pages = fetchPageNumbers(footerPagination.pageCount, pageNeighbours, footerPagination.pagination.currentPage);

  return (
    <Flex width={1} alignItems="center" justifyContent="space-between">
      <Text fontSize="12" color="palette.grey">
        {
          buildDataGridFooterTranslations(
            intl,
            'DataGrid',
            footerPagination.rowCount,
            footerPagination.pagination.currentPage,
            footerPagination.pagination.count
          ).infoText
        }
      </Text>
      <Flex>
        <PseudoBox
          onClick={() => handlePageNumberChange(footerPagination.pagination.currentPage - 1)}
          disabled={footerPagination.pagination.currentPage === 1}
          {...commonButtonProps}
        >
          <Icon name="far fa-chevron-left" fontSize="12" />
        </PseudoBox>
        {pages.map((page, index) => {
          if (page === LEFT_PAGE)
            return (
              <PseudoBox key={index.toString()} onClick={e => e.preventDefault()} {...commonButtonProps}>
                ...
              </PseudoBox>
            );

          if (page === RIGHT_PAGE)
            return (
              <PseudoBox key={index.toString()} onClick={e => e.preventDefault()} {...commonButtonProps}>
                ...
              </PseudoBox>
            );

          let activeProps;
          const isCurrentPage = footerPagination.pagination.currentPage === page;

          if (isCurrentPage) {
            activeProps = {
              bg: 'text.link',
              color: 'palette.white',
              border: '0',
            };
          }

          return (
            <PseudoBox
              key={index.toString()}
              onClick={() => handlePageNumberChange(page)}
              {...commonButtonProps}
              {...(isCurrentPage && activeProps)}
            >
              {page}
            </PseudoBox>
          );
        })}
        <PseudoBox
          onClick={() => handlePageNumberChange(footerPagination.pagination.currentPage + 1)}
          disabled={footerPagination.pagination.currentPage === footerPagination.pageCount}
          {...commonButtonProps}
        >
          <Icon name="far fa-chevron-right" fontSize="12" />
        </PseudoBox>
      </Flex>
    </Flex>
  );
};

export default injectIntl(DqbPaginationFooter);
