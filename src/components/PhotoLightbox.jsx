import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PhotoLightbox({ slides, index, onClose, labels }) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={slides}
      labels={labels}
      controller={{ closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: "rgba(8, 45, 65, 0.97)" } }}
    />
  );
}
