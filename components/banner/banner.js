import styles from './banner.module.css';
const Banner = ({ buttonText, handleOnClick }) => {
  const { container, title, title1, title2, subTitle, button, buttonWrapper } =
    styles;
  return (
    <div className={container}>
      <h1 className={title}>
        <span className={title1}>Coffee</span>
        <span className={title2}>Connoisseur</span>
      </h1>
      <p className={subTitle}>Discover your local coffee shops!</p>
      <div className={buttonWrapper}>
        <button className={button} onClick={handleOnClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
