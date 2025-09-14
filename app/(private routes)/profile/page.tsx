import type { Metadata } from "next";
import Image from "next/image";
import css from "./ProfilePage.module.css";
import { serverGetMe } from "@/lib/api/serverApi";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const me = await serverGetMe();
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <a href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </a>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={me.photoUrl || "/vercel.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {me.userName || "—"}</p>
          <p>Email: {me.email}</p>
        </div>
      </div>
    </main>
  );
}
