interface NoContentProps {
  message?: string;
}

function NoContent({ message = '게시글이 없습니다.' }: NoContentProps) {
  return (
    <div className="h-[400px] flex items-center justify-center">
      <div className="text-center text-gray-500">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default NoContent;
