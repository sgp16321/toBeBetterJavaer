import{_ as e}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,o as a,e as r}from"./app-CiW81ZiS.js";const n={},i=r('<p>继 <a href="https://javabetter.cn/gongju/tabby.html" target="_blank" rel="noopener noreferrer">Tabby</a>、<a href="https://javabetter.cn/gongju/warp.html" target="_blank" rel="noopener noreferrer">Warp</a> 后，今天再来给大家推荐一款终端神器——WindTerm，完全开源，在 GitHub 上已经收获 6.6k 的 star。</p><blockquote><p><a href="https://github.com/kingToolbox/WindTerm" target="_blank" rel="noopener noreferrer">https://github.com/kingToolbox/WindTerm</a></p></blockquote><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-5220349e-fb8b-41c8-94c7-9d37b0eeaa82.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>作者还拿 WindTerm 和 Putty、xterm、Windows Terminal + ssh.exe、iterm2、rxvt、Gnome等等做了一个性能对比，结果其他终端均被吊打的不成样子，真正的<strong>杀人诛心</strong></p><p>哈哈哈哈哈哈哈哈哈哈</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-d2958336-7d9b-46a5-9fd4-224b195dba03.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>工具不嫌多，哪个顺手用哪个，对吧？没毛病吧😁</p><h2 id="安装-windterm" tabindex="-1"><a class="header-anchor" href="#安装-windterm"><span>安装 WindTerm</span></a></h2><p>WindTerm 不仅开源免费，还跨平台，支持 Windows、Linux 和 macOS。</p><p>直接到 release 页面选择适合自己操作系统的安装包。</p><blockquote><p><a href="https://github.com/kingToolbox/WindTerm/releases" target="_blank" rel="noopener noreferrer">https://github.com/kingToolbox/WindTerm/releases</a></p></blockquote><p>体积 30M 左右，相对于动辄 200M 左右的安装包，真的是良心。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f7abe795-d43b-4f53-93a5-e59241d45930.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>安装完成后，打开的界面和传统的终端不太一样，WindTerm 更像 IDE 的布局，左边是资源管理器+文件管理器，中间会默认打开一个 zsh 的终端窗口，右边是会话窗口+历史命令窗口，底部是发送窗口 + Shell 窗口。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-28d20f75-c5d0-47bf-96db-a2f470f03c42.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="使用-windterm" tabindex="-1"><a class="header-anchor" href="#使用-windterm"><span>使用 WindTerm</span></a></h2><h3 id="ssh" tabindex="-1"><a class="header-anchor" href="#ssh"><span>SSH</span></a></h3><p>使用终端最重要的一个场景就是 SSH，连接远程服务器，我这里有一个 1G 内存的轻量级云服务器，我们来连接它体验一下。</p><p>点击新建会话按钮开始 SSH 连接。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-21565ed0-90d8-466f-b505-d1d2f58388be.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>添加主机名，点击「连接」开始进行远程链接。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-fec8d31e-aa33-4d5e-b0c0-4c7f09ea208b.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>紧接着输入用户名和密码，我们关掉一些没必要的窗口，让整个界面更加清爽一些。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-aae1b222-c6da-4285-8efe-e87e5cc66702.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>如果感觉字体比较小的话，可以直接按住**「command+」**两个组合键放大字体。</p><p>WindTerm 给我一个非常直观的操作是，它提供了一个折叠的功能，点击-号折叠，点击+号展开。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-e3415e9c-d002-4492-af9d-83b02e87c7d8.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>还有一个就是智能提示，非常到位，响应速度很快。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-a34d2157-3a5d-4afa-a5c4-2cc323244c4f.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="sftp" tabindex="-1"><a class="header-anchor" href="#sftp"><span>SFTP</span></a></h3><p>除了 SSH，还有一个重要的场景就是上传文件，我们知道，Xshell 是直接将 FTP 分离了出去，我总觉得这个产品分割设计很脑残，放在一起挺好的。</p><p>WindTerm 是放在一起的，直接打开文件文件管理器，选择文件上传还是直接拖拽，都非常便利。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-e23d187e-9d67-4e6a-9b22-e9a3a0e459a5.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>文件上传完成后会有一个进度条提示。</p><p>如果想直接在 SSH 窗口中上传文件的话，就需要安装lrzsz。如果没安装的话，会提示错误❎。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-3eb27b2e-ba98-44f2-8ec3-4ec86e9f62d1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>因为我的远程服务器是 CentOS，所以执行 <code>yum install lrzsz</code>就可以直接安装了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-c6f757b9-a6e0-4bd9-beef-9ce501cbdf41.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>安装完成后就可以直接在 SSH 上传文件了，和其他终端不同的是，WindTerm 会有进度条提示。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-ee7b8acf-6e39-42d7-ab92-bf8e24243c38.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>WindTerm 还提供了高速传输模式，上传下载速度更快。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f2315d1b-d6c9-4eff-8470-2088cff6cd05.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>搞定 SSH 和 SFTP，一个终端的基础功能就全具备了，这也是我们最常用的两个场景。WindTerm 在这两方面都做的不错。</p><h3 id="自动补全" tabindex="-1"><a class="header-anchor" href="#自动补全"><span>自动补全</span></a></h3><p>WindTerm 的自动补全功能还是非常强大的，只需要在行首键入 <code>!</code> 就可以调出历史命令，然后使用向下的箭头选择历史命令就 OK 了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-838a4711-4e09-46d7-a0d5-99e302889d27.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>WindTerm 能够自动补全的命令非常全面，支持：</p><ul><li>Linux Shell 命令。</li><li>MacOS Shell 命令。</li><li>Windows Cmd 命令。</li><li>PowerShell 命令。</li><li>任何命令行程序的命令，例如 Git</li></ul><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-62b525bf-c4c6-4e3a-b313-884c945809e3.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="配置-windterm" tabindex="-1"><a class="header-anchor" href="#配置-windterm"><span>配置 WindTerm</span></a></h2><h3 id="如何重置锁屏密码" tabindex="-1"><a class="header-anchor" href="#如何重置锁屏密码"><span>如何重置锁屏密码</span></a></h3><p>不过有点小尴尬😓的是，WindTerm有自动锁屏的功能，过段时间（默认 30 分钟）没有操作，就会自动锁屏。然而，我之前并没有设置过锁屏密码，这就好像我自己的门我自己锁了，却没有钥匙🔑。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-17017bd4-4da6-41f5-bf48-2b056dbfe258.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>虽然提供了更改主密码的功能，但我就不知道初始密码是什么，就更尴尬了。</p><p>怎么办？</p><p>遇事不决问 issue：<strong>如何重置锁屏密码</strong>！</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-759ffc3b-0119-4a2b-bce5-68c7f8612b31.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>果然已经有小伙伴提出了这个问题，我们顺藤摸瓜就可以搞定了，找到 user.config 文件。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f4a8b033-5d77-4361-935e-66c210e67690.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>干掉 application.fingerprint 和 application.masterPassword。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-4cd13932-07a3-4696-9752-265ed76c4463.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>再找到 .wind/profiles/default.v10/terminal/user.sessions 文件删除 session.autoLogin 就可以将主密码设置为空字符串了，之后再来修改主密码，就 OK 了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-21423050-3de4-4afe-9e4a-0b073c4f6504.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="更换主题" tabindex="-1"><a class="header-anchor" href="#更换主题"><span>更换主题</span></a></h3><p>WindTerm 支持三种主题的切换，亮白模式、暗黑模式、黑白相间模式。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-6b123b12-903e-4040-86e6-95162df4aa09.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>我们来切换到亮白模式体验一下，还不错。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-a18114a4-17d5-4f83-b96d-f9007d67e560.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="自动复制" tabindex="-1"><a class="header-anchor" href="#自动复制"><span>自动复制</span></a></h3><p>只需要在设置中，找到文本一栏，勾选「自动复制选定内容」就可以了。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-fd333685-e76e-434c-832e-2f2b594dfd35.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>选中内容，然后就直接复制了。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>总的来说，WindTerm 的体验不错，除了我上面提到的这些基础功能外，像分屏啊，转接端口啊，并且在 Windows 下的体验要比 macOS 操作系统下更酷一些。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-201419f5-0097-4fe2-b24f-3d35c25c18d0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>作者把两者的使用技巧全部分享到了下面这个网址上，小伙伴们可以去解锁一下。</p><blockquote><p><a href="https://kingtoolbox.github.io/" target="_blank" rel="noopener noreferrer">https://kingtoolbox.github.io/</a></p></blockquote><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',78),o=[i];function g(b,d){return a(),t("div",null,o)}const m=e(n,[["render",g],["__file","windterm.html.vue"]]),s=JSON.parse('{"path":"/gongju/windterm.html","title":"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！","lang":"zh-CN","frontmatter":{"title":"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！","shortTitle":"WindTerm：新一代终端工具","category":["Java企业级开发"],"tag":["辅助工具"],"description":"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！","head":[["meta",{"name":"keywords","content":"辅助工具,GitHub,终端,WindTerm,WindTerm 教程,WindTerm 终端,Java企业级开发"}],["meta",{"property":"og:url","content":"https://javabetter.cn/gongju/windterm.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！"}],["meta",{"property":"og:description","content":"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-5220349e-fb8b-41c8-94c7-9d37b0eeaa82.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"辅助工具"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"WindTerm：新一代开源免费的终端工具，GitHub星标6.6k+，太酷了！\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-5220349e-fb8b-41c8-94c7-9d37b0eeaa82.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-d2958336-7d9b-46a5-9fd4-224b195dba03.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f7abe795-d43b-4f53-93a5-e59241d45930.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-28d20f75-c5d0-47bf-96db-a2f470f03c42.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-21565ed0-90d8-466f-b505-d1d2f58388be.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-fec8d31e-aa33-4d5e-b0c0-4c7f09ea208b.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-aae1b222-c6da-4285-8efe-e87e5cc66702.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-e3415e9c-d002-4492-af9d-83b02e87c7d8.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-a34d2157-3a5d-4afa-a5c4-2cc323244c4f.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-e23d187e-9d67-4e6a-9b22-e9a3a0e459a5.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-3eb27b2e-ba98-44f2-8ec3-4ec86e9f62d1.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-c6f757b9-a6e0-4bd9-beef-9ce501cbdf41.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-ee7b8acf-6e39-42d7-ab92-bf8e24243c38.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f2315d1b-d6c9-4eff-8470-2088cff6cd05.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-838a4711-4e09-46d7-a0d5-99e302889d27.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-62b525bf-c4c6-4e3a-b313-884c945809e3.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-17017bd4-4da6-41f5-bf48-2b056dbfe258.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-759ffc3b-0119-4a2b-bce5-68c7f8612b31.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-f4a8b033-5d77-4361-935e-66c210e67690.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-4cd13932-07a3-4696-9752-265ed76c4463.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-21423050-3de4-4afe-9e4a-0b073c4f6504.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-6b123b12-903e-4040-86e6-95162df4aa09.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-a18114a4-17d5-4f83-b96d-f9007d67e560.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-fd333685-e76e-434c-832e-2f2b594dfd35.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/windterm-201419f5-0097-4fe2-b24f-3d35c25c18d0.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":2,"title":"安装 WindTerm","slug":"安装-windterm","link":"#安装-windterm","children":[]},{"level":2,"title":"使用 WindTerm","slug":"使用-windterm","link":"#使用-windterm","children":[{"level":3,"title":"SSH","slug":"ssh","link":"#ssh","children":[]},{"level":3,"title":"SFTP","slug":"sftp","link":"#sftp","children":[]},{"level":3,"title":"自动补全","slug":"自动补全","link":"#自动补全","children":[]}]},{"level":2,"title":"配置 WindTerm","slug":"配置-windterm","link":"#配置-windterm","children":[{"level":3,"title":"如何重置锁屏密码","slug":"如何重置锁屏密码","link":"#如何重置锁屏密码","children":[]},{"level":3,"title":"更换主题","slug":"更换主题","link":"#更换主题","children":[]},{"level":3,"title":"自动复制","slug":"自动复制","link":"#自动复制","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{},"readingTime":{"minutes":4.9,"words":1469},"filePathRelative":"gongju/windterm.md","excerpt":"<p>继 <a href=\\"https://javabetter.cn/gongju/tabby.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Tabby</a>、<a href=\\"https://javabetter.cn/gongju/warp.html\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">Warp</a> 后，今天再来给大家推荐一款终端神器——WindTerm，完全开源，在 GitHub 上已经收获 6.6k 的 star。</p>\\n<blockquote>\\n<p><a href=\\"https://github.com/kingToolbox/WindTerm\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://github.com/kingToolbox/WindTerm</a></p>\\n</blockquote>"}');export{m as comp,s as data};
