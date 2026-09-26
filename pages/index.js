export async function getServerSideProps() { return { redirect: { destination: '/site.html', permanent: false } }; }
export default function Home() { return null; }
