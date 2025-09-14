import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={me.avatar || "/vercel.svg"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {me.username || "—"}</p>
          <p>Email: {me.email}</p>
        </div>
      </div>
    </main>
  );
}
