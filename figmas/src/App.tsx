import { StreamingJsonGenerator } from './components/StreamingJsonGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">AI JSON 流式输出展示</h1>
          <p className="text-muted-foreground">
            实时展示AI正在生成的JSON文件内容
          </p>
        </div>
        <StreamingJsonGenerator />
      </div>
    </div>
  );
}