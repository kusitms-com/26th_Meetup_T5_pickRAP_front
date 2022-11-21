import { css } from '@emotion/react';

import PhotoListItem from '@/components/magazine/PhotoListItem';

interface MainMagazineProps {
  magazines: MagazineThumbnail[];
}
const MainMagazine = ({ magazines }: MainMagazineProps) => {
  return (
    <div
      css={css`
        display: flex;
        overflow-x: scroll;
        width: 100%;
        gap: 10px;
        margin-bottom: 48px;
      `}
    >
      {magazines.map((magazine) => (
        <PhotoListItem key={magazine.cover_url} item={magazine} width={'120px'} height={'155px'} />
      ))}
    </div>
  );
};

export default MainMagazine;
