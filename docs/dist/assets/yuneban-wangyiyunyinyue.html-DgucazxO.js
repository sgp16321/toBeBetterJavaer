import{_ as a}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as e,e as i}from"./app-CiW81ZiS.js";const s={},t=i(`<h1 id="云音乐" tabindex="-1"><a class="header-anchor" href="#云音乐"><span>云音乐</span></a></h1><p>大家好，我是二哥呀！</p><p>前段时间，有个读者私信我说，<strong>刚学完 Spring Boot，想找点练手项目，准备找实习了。</strong></p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>二哥这么贴心，对于读者的请求，一向是有求必应，有问必答。那自然得花心思去淘 2 个像样的 Java 练手项目出来了，关键是还要基础，不能太难😆。</p><p>我之前有给大家推荐过 GitHub 上的 vhr、mall 和 miaosha，那这次想换个思路，到 B 站上淘一淘如何呢？</p><p>果真，还真让二哥找到了！小破站，YYDS！</p><h3 id="一、云-e-办" tabindex="-1"><a class="header-anchor" href="#一、云-e-办"><span>一、云 E 办</span></a></h3><p>这是一个带大家从 0 搭建一个 Spring Boot+ Vue 的前后端分离的 Java 项目，前 P71 讲前端，P72 到 P131 讲后端。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>前端涉及到的技术有 Vue 全家桶、ElementUI；后端涉及到的技术有 Spring Boot、SpringMVC、MyBatisPlus、SpringSecurity、Swagger、Redis、EasyPOI、RabbitMQ、FasfDFS 等等。</p><p>视频整体上是不错的，up 的声音也很清晰，听起来很舒服。</p><p>为了验证 up 是不是一家培训机构，顺带替大家踩踩坑。我按照要求加了小助理的微信：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-03.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>加好友时一看头像，和平常偷偷摸摸混进群的广告党差不多，哈哈哈。</p><p>通过好友后，再去一查「乐字节」这个关键字，果然是一家培训机构，不过视频既然公开了出来，并且质量也说得过去，那果断学习一波也是很舒服的。</p><p>有时候，培训机构公开出来的视频课可能要好过付费小几万的付费视频课，毕竟拿出来的东西不能太水，否则会砸了自己招牌。</p><p>况且，二哥深入虎穴这一波也替大家踩过坑了，源码和课件都拿到了，直接在公众号后台回复关键字「<strong>B站</strong>」就可以拉取到了，不用再去加小助理微信了，大家可以放心食用。</p><p>怎么样，二哥这波安全拦截做得漂亮吧？</p><h3 id="二、仿网易云音乐的小网站" tabindex="-1"><a class="header-anchor" href="#二、仿网易云音乐的小网站"><span>二、仿网易云音乐的小网站</span></a></h3><p>这是读者提供的一个前后端分离项目，问我项目怎么样，我点开去一看，这不一个号主朋友的嘛。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-04.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>网站的客户端和管理端使用 VUE 框架来实现的，服务端使用 Spring Boot + MyBatis 来实现，数据库使用了 MySQL。建议至少 1.5 倍速食用。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-05.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>前后端整体的项目结构也挺清晰的，这是后端的。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>├── avatorImages // 用户头像</span></span>
<span class="line"><span>├── img</span></span>
<span class="line"><span>│   ├── singerPic // 歌手图片</span></span>
<span class="line"><span>│   ├── songListPic // 歌单图片</span></span>
<span class="line"><span>│   └── songPic // 歌曲图片</span></span>
<span class="line"><span>├── song // 存放歌曲</span></span>
<span class="line"><span>├── src</span></span>
<span class="line"><span>│   ├── main</span></span>
<span class="line"><span>│   │   ├── java</span></span>
<span class="line"><span>│   │   │   └── com.example.demo</span></span>
<span class="line"><span>│   │   │       ├── config // 配置（跨域）</span></span>
<span class="line"><span>│   │   │       ├── controller // 控制层，接收请求返回响应</span></span>
<span class="line"><span>│   │   │       ├── dao // 数据操作层</span></span>
<span class="line"><span>│   │   │       ├── domain // 实体类</span></span>
<span class="line"><span>│   │   │       ├── service</span></span>
<span class="line"><span>│   │   │       │   └── impl // Service 层的接口</span></span>
<span class="line"><span>│   │   │       └── HwMusicApplicationTests.java // 项目入口</span></span>
<span class="line"><span>│   │   └── resources</span></span>
<span class="line"><span>│   │       ├── mapper // mapper.xml文件，操作数据库</span></span>
<span class="line"><span>│   │       ├── static // 存放静态资源</span></span>
<span class="line"><span>│   │       ├── templates</span></span>
<span class="line"><span>│   │       ├── application.properties // 连接数据库</span></span>
<span class="line"><span>│   │       └── generatorConfig.xml // MyBatis Generator 自动生成代码</span></span>
<span class="line"><span>│   └── test</span></span>
<span class="line"><span>│       └── java</span></span>
<span class="line"><span>│           └── com.example.demo // 测试用的</span></span>
<span class="line"><span>├── pom.xml // 添加相关依赖和插件</span></span>
<span class="line"><span>└── target</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>整体的思路很简单，前端要访问数据的时候，后端就提供相应接口，通过 Controller 层监听请求， 数据的处理交给 Service 层，而 Service 层再通过 Mapper 层操作数据库，操作完成后数据再一层层往上走，最后返回给前端。</p><p>up 也非常的良心，源码都开源到 GitHub 上了。</p><blockquote><p>https://github.com/Yin-Hongwei/music-website</p></blockquote><p>随便再展示两张项目的效果图吧。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-06.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-07.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>项目的基本功能也很完善：</p><ul><li>音乐播放</li><li>用户登录注册</li><li>用户信息编辑、头像修改</li><li>歌曲、歌单搜索</li><li>歌单打分</li><li>歌单、歌曲评论</li><li>歌单列表、歌手列表分页显示</li><li>歌词同步显示</li><li>音乐收藏、下载、拖动控制、音量控制</li><li>后台对用户、歌曲、歌手、歌单信息的管理</li></ul><p>作为练手项目，绝壁是合适的。</p><hr><p>跟着视频做练手项目的最大好处就是，可以实时地看到 up 主手敲代码的过程，顺带还可以体验一把产品经理的快乐，给 up 主提需求，哈哈。</p><p>这里分享一下二哥在观看视频中最大的快乐：review 代码，哈哈哈，尤其是看到 up 敲错代码出现 bug 时，我内心是极其快乐（痛苦）的，因为这让我想起刚实习时被 leader 劈头盖脸批评时的窘境。。</p><p>大学阶段做的练手项目没必要做太高大上的，也没必要追求三高：高并发、高可用、高性能，就简简单单的，把所学到的知识运用进去，能达到检验学习成果的目的就 OK 了。</p>`,39),p=[t];function r(l,o){return e(),n("div",null,p)}const g=a(s,[["render",r],["__file","yuneban-wangyiyunyinyue.html.vue"]]),y=JSON.parse('{"path":"/kaiyuan/yuneban-wangyiyunyinyue.html","title":"云音乐","lang":"zh-CN","frontmatter":{"category":["Java企业级开发"],"tag":["辅助工具/轮子"],"description":"云音乐 大家好，我是二哥呀！ 前段时间，有个读者私信我说，刚学完 Spring Boot，想找点练手项目，准备找实习了。 二哥这么贴心，对于读者的请求，一向是有求必应，有问必答。那自然得花心思去淘 2 个像样的 Java 练手项目出来了，关键是还要基础，不能太难😆。 我之前有给大家推荐过 GitHub 上的 vhr、mall 和 miaosha，那这...","head":[["meta",{"property":"og:url","content":"https://javabetter.cn/kaiyuan/yuneban-wangyiyunyinyue.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"云音乐"}],["meta",{"property":"og:description","content":"云音乐 大家好，我是二哥呀！ 前段时间，有个读者私信我说，刚学完 Spring Boot，想找点练手项目，准备找实习了。 二哥这么贴心，对于读者的请求，一向是有求必应，有问必答。那自然得花心思去淘 2 个像样的 Java 练手项目出来了，关键是还要基础，不能太难😆。 我之前有给大家推荐过 GitHub 上的 vhr、mall 和 miaosha，那这..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-01.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"辅助工具/轮子"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"云音乐\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-01.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-02.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-03.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-04.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-05.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-06.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-07.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":3,"title":"一、云 E 办","slug":"一、云-e-办","link":"#一、云-e-办","children":[]},{"level":3,"title":"二、仿网易云音乐的小网站","slug":"二、仿网易云音乐的小网站","link":"#二、仿网易云音乐的小网站","children":[]}],"git":{},"readingTime":{"minutes":4.06,"words":1217},"filePathRelative":"kaiyuan/yuneban-wangyiyunyinyue.md","excerpt":"\\n<p>大家好，我是二哥呀！</p>\\n<p>前段时间，有个读者私信我说，<strong>刚学完 Spring Boot，想找点练手项目，准备找实习了。</strong></p>\\n<figure><img src=\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/kaiyuan/yuneban-wangyiyunyinyue-01.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></figure>\\n<p>二哥这么贴心，对于读者的请求，一向是有求必应，有问必答。那自然得花心思去淘 2 个像样的 Java 练手项目出来了，关键是还要基础，不能太难😆。</p>","autoDesc":true}');export{g as comp,y as data};
