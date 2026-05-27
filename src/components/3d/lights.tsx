export function Lights() {
  return (
    <>
      {/* Base Environment Light */}
      <ambientLight intensity={0.8} />

      {/* Top Highlight */}
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#a855f7" />
    </>
  );
}
