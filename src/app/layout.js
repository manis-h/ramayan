import localFont from "next/font/local";
import "./globals.css";
import ModalSpinner from "./component/ModalSpinner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Shree Dharmic Ramleela",
  description: "Shree Dharmic Ramleela Since 1923 Prade Ground",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ModalSpinner />
        {children}
      </body>
    </html>
  );
}
