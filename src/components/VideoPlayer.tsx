import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";

interface VideoPlayerProps {
  videoKey: string;
  videoName: string;
  buttonLabel?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoKey,
  videoName,
  buttonLabel = "Xem video",
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<PlayArrowIcon />}
        onClick={handleOpen}
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {videoName}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: "inherit",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            sx={{
              paddingBottom: "56.25%",
              position: "relative",
              height: 0,
            }}
          >
            <iframe
              title={videoName}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoKey}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
