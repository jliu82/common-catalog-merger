import Head from 'next/head'
import styles from '../styles/Home.module.css'
import FileUploader from "../features/category-merger/components/file-uploader"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Category merger</title>
        <meta name="description" content="Merge category from Company A and Company B" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Category merger
        </h1>

        <p className={styles.description}>
          Select INPUT directory and run merge{' '}      
        </p>
        <FileUploader/>

      </main>

    </div>
  )
}
