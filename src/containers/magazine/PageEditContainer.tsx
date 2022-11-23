import type { Theme } from '@emotion/react';
import { css } from '@emotion/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import useToast from '@/application/hooks/common/useToast';
import { usePage } from '@/application/store/magazine/hook';
import type { EditPage } from '@/application/store/magazine/state';
import { ActiveButton } from '@/components/common/Button';
import Photo from '@/components/common/Photo';
import ToastInput from '@/components/common/Toast/ui/Input';

/**
 * @desc  구현 사항
 * 1. 새로 고침 또는 페이지 뒤로 가기 클릭 시 confirm 모달
 * 2. 다중 선택 토스트에서 {scrap id, src, text}[], start number dispatch 후 redirect
 * 3. scrap id carousel, start number
 * 4. recoil에 page text 있으면 placeholder, active button 렌더링
 * 5. 텍스트 입력 토스트 완료 시 set state
 * 6. 페이지네이션 버튼, 저장 버튼 누를 시 text recoil dispatch
 * 7. 페이지네이션 버튼 클릭 시, recoil {scrap id, url, text} get by page number
 * 8. 저장 버튼 누를 시 mutation
 */

interface Props {
  pages: EditPage[];
  startPage: number;
}
const PageEditContainer = ({ pages, startPage = 0 }: Props) => {
  const [currentPage, setCurrentPage] = useState(startPage);

  const { show, close } = useToast();
  const [_, setPageInfo] = usePage(currentPage);

  const getPrevPage = (num: number) => (num > startPage ? num - 1 : num);
  const getNextPage = (num: number) => (num < startPage + pages.length - 1 ? num + 1 : num);

  const toastProps = {
    onSubmit: (value: string) => {
      setPageInfo({ text: value });
      close();
    },
    label: '텍스트 입력',
    submit: '완료',
    type: 'textarea' as const,
    title: '텍스트 입력하기',
  };
  return (
    <>
      <span
        css={(theme) =>
          css`
            ${theme.font.R_BODY_12};
            color: ${theme.color.gray05};
            line-height: 26px;
            letter-spacing: 0.005em;
            margin-left: auto;
            margin-bottom: 2px;
          `
        }
      >
        {currentPage + 1} 페이지
      </span>
      <article
        css={css`
          position: relative;
          flex: 1 1 auto;
        `}
      >
        <ol css={CSSCarouselContainer}>
          {pages.map((page, idx) => (
            <li key={page.scrap_id} id={`${idx + startPage}`} css={CSSCarouselItem}>
              <div
                css={css`
                  width: 100%;
                  border: 2px solid #dbdbdb;
                  border-radius: 4px;
                  padding: min(40px, 4.8vh);
                `}
              >
                <Photo src={page.src} height={'33vh'} />
                <p
                  css={CSSPageContent}
                  onClick={() =>
                    show({
                      content: <ToastInput {...toastProps} />,
                    })
                  }
                >
                  {page.text || '클릭하여 텍스트를 남겨보세요.'}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {pages.length > 1 && (
          <div
            css={css`
              position: absolute;
              bottom: 16px;
              right: 0;
              gap: 12px;
              display: flex;
            `}
          >
            <Link href={{ hash: `${getPrevPage(currentPage)}` }}>
              <Image
                onClick={() => setCurrentPage(getPrevPage(currentPage))}
                src={'/icon/magazine/prevPage.svg'}
                width={48}
                height={48}
              />
            </Link>
            <Link href={{ hash: `${getNextPage(currentPage)}` }}>
              <Image
                onClick={() => setCurrentPage(getNextPage(currentPage))}
                src={'/icon/magazine/nextPage.svg'}
                width={48}
                height={48}
              />
            </Link>
          </div>
        )}
      </article>
      <ActiveButton active>저장</ActiveButton>
    </>
  );
};

const CSSCarouselContainer = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  overflow-x: auto;
  counter-reset: item;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
`;

const CSSCarouselItem = css`
  position: relative;
  flex: 0 0 100%;
  width: 100%;
  margin-right: min(40px, 5vh);
  display: flex;
  flex-direction: column;

  counter-increment: item;
`;

const CSSPageContent = (theme: Theme) =>
  css`
    word-break: break-all;
    margin-top: 24px;
    ${theme.font.R_BODY_13};
    color: ${theme.color.gray04};
    letter-spacing: 0.005em;
    line-height: 20px;
    height: 18.7vh;

    align-items: center;
    justify-content: center;
    width: 100%;
    display: flex;

    border: 2px dashed ${theme.color.gray07};
    border-radius: 4px;
  `;

export default PageEditContainer;
