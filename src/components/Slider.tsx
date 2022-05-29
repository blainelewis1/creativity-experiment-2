import "./slider.css";

const Slider: React.FunctionComponent<React.ComponentProps<"input">> = ({
  className,
  ...props
}) => {
  return (
    <input
      type="range"
      {...props}
      className={`flex-1 w-full cursor-pointer slider ${className}`}
    />
  );
};

export default Slider;
