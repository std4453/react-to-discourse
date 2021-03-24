import React, { useEffect, useState } from 'react';
import { ajax } from "discourse/lib/ajax";
import test from './assets/test.png';

function App() {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const response = await ajax("directory_items.json", {
                    data: {
                        period: 'weekly',
                        order: 'likes_received',
                    },
                });
                setData(response);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);
    return (
        <div>
            <div>周榜单</div>
            <img src={test}/>
            {data ? (
                <table style={{ width: '100%' }}>
                    <tr>
                        <td className="td">
                            用户名
                        </td>
                        <td className="td">
                            获得赞
                        </td>
                        <td className="td">
                            发帖数量
                        </td>
                        <td className="td">
                            登陆天数
                        </td>
                    </tr>
                    {data.directory_items.map(({
                        user: { username }, likes_received, post_count, days_visited,
                    }) => (
                        <tr>
                            <td className="td">
                                <a href={`/u/${username}`}>
                                    {username}
                                </a>
                            </td>
                            <td className="td">
                                {likes_received}
                            </td>
                            <td className="td">
                                {post_count}
                            </td>
                            <td className="td">
                                {days_visited} 天
                            </td>
                        </tr>
                    ))}
                </table>
            ) : (
                <div>加载中……</div>
            )}
        </div>
    );
}

export default App;
