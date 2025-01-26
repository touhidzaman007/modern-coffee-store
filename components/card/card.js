import Link from 'next/link';
import styles from './card.module.css';
import Image from 'next/image';
import cls from 'classnames';
const Card = ({ name, imgUrl, href }) => {
  const {
    container,
    cardLink,
    cardHeader,
    cardHeaderWrapper,
    cardImage,
    cardImageWrapper,
  } = styles;

  return (
    <Link href={href} className={cardLink}>
      <div className={cls('glass', container)}>
        <div className={cardHeaderWrapper}>
          <h2 className={cardHeader}>{name}</h2>
        </div>
        <div className={cardImageWrapper}>
          <Image
            className={cardImage}
            src={imgUrl}
            alt={name}
            width={260}
            height={160}
          />
        </div>
      </div>
    </Link>
  );
};

export default Card;
