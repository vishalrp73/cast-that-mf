type SubtitlesConfig = {
  backgroundColor?: string;
  foregroundColor?: string;
  edgeType?: "NONE" | "OUTLINE" | "DROP_SHADOW" | "RAISED" | "DEPRESSED";
  edgeColor?: string;
  fontScale?: number;
  fontStyle?: "NORMAL" | "BOLD" | "ITALIC" | "BOLD_ITALIC";
  fontFamily?: string;
  fontGenericFamily?:
    | "SANS_SERIF"
    | "MONOSPACED_SANS_SERIF"
    | "SERIF"
    | "MONOSPACED_SERIF"
    | "CASUAL"
    | "CURSIVE"
    | "SMALL_CAPITALS";
  windowColor?: string;
  windowRoundedCornerRadius?: number;
  windowType?: "NONE" | "NORMAL" | "ROUNDED_CORNERS";
};

export const subtitlesConfig: SubtitlesConfig = {
  backgroundColor: "#FFFFFF00", // see http://dev.w3.org/csswg/css-color/#hex-notation
  foregroundColor: "#FFFFFFFF", // see http://dev.w3.org/csswg/css-color/#hex-notation
  edgeType: "OUTLINE", // can be: "NONE", "OUTLINE", "DROP_SHADOW", "RAISED", "DEPRESSED"
  edgeColor: "#000000FF", // see http://dev.w3.org/csswg/css-color/#hex-notation
  fontScale: 1.2, // transforms into "font-size: " + (fontScale*100) +"%"
  fontStyle: "BOLD", // can be: "NORMAL", "BOLD", "BOLD_ITALIC", "ITALIC",
  fontFamily: "Droid Sans",
  fontGenericFamily: "SANS_SERIF", // can be: "SANS_SERIF", "MONOSPACED_SANS_SERIF", "SERIF", "MONOSPACED_SERIF", "CASUAL", "CURSIVE", "SMALL_CAPITALS",
  windowColor: "#AA00FFFF", // see http://dev.w3.org/csswg/css-color/#hex-notation
  windowRoundedCornerRadius: 10, // radius in px
  windowType: "ROUNDED_CORNERS", // can be: "NONE", "NORMAL", "ROUNDED_CORNERS"
};
