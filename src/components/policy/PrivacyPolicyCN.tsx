import React from 'react';
import { Section, SubSection } from '../../components/policy/Section';
import { PermissionsTable } from '../../components/policy/PermissionsTable';
import { permissionDataCN } from '../../components/policy/permissionData';

interface PrivacyPolicyCNProps {
  onNavigateToChildrenPolicy?: () => void;
}

export const PrivacyPolicyCN: React.FC<PrivacyPolicyCNProps> = ({ onNavigateToChildrenPolicy }) => {
  return (
    <div className="animate-fade-in">
      {/* Header Area */}
      <div className="bg-blue-600 text-white p-8 -mx-8 -mt-8 mb-8 rounded-t-2xl">
        <h1 className="text-3xl font-bold mb-2">afreshtrip 隐私政策</h1>
        <p className="opacity-90 text-sm">适用范围：中国大陆地区用户 | 版本：CN-2025-V1</p>
      </div>

      {/* Introduction */}
      <Section title="引言">
        <p>
          欢迎您使用 afreshtrip 软件及相关服务！afreshtrip 是由安思达乐（杭州）信息科技有限公司（以下简称“我们”）开发并运营的一款旅游路线规划软件。
          我们的注册地址为<strong>浙江省杭州市西湖区三墩镇智汇众创中心2号楼1403室【2】</strong>。
        </p>
        <p>
          我们深知个人信息对您的重要性，也深知您的信任对我们至关重要。我们坚信：隐私和安全是用户体验的基石。
          因此，我们制定了本《afreshtrip基本功能隐私政策》（以下简称“本政策”），旨在以清晰、透明的方式，向您说明您在使用 afreshtrip 服务时，
          我们如何收集、使用、存储、保护和共享您的个人信息，并告知您享有的权利。
        </p>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm font-medium">
          请您在使用我们的服务前，仔细阅读、充分理解本政策的全部内容，特别是以加粗或下划线等形式提示您注意的条款。
          一旦您开始下载、访问或使用 afreshtrip，即表示您已完全同意并接受本政策的所有约定。
        </div>
        
        {/* Consent Checkboxes */}
        <div className="bg-slate-50 border border-slate-200 p-4 my-4 rounded-md">
          <p className="text-sm font-bold text-slate-700 mb-2">在开始使用前，请确认：</p>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-slate-700">您已经仔细阅读并同意《afreshtrip隐私政策》</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
              <span className="text-slate-700">您同意在符合法规的情况下与第三方共享您的数据</span>
            </label>
          </div>
        </div>
      </Section>

      {/* Chapter 1: Collection */}
      <Section title="一、个人信息收集与使用场景">
        <p>
          我们严格遵循合法、正当、必要的原则，以明确、具体、合理的目的是为准则，收集和使用您的个人信息。
          您可以在设备的【我的 -&gt; 设置 -&gt; 隐私中心】中随时关闭以下权限。
        </p>

        <SubSection title="1.1 为您提供核心旅游规划服务">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>位置信息：</strong>在您授权后，我们会通过IP地址、GPS、Wi-Fi接入点等方式收集您的
              <span className="text-slate-900 font-semibold">精确或大致地理位置</span>。
              这是本服务的核心，用于为您规划从您当前位置到目的地的路线。
            </li>
            <li>
              <strong>搜索与浏览信息：</strong>当您使用搜索框或浏览推荐景点时，我们会收集您的
              <span className="text-slate-900 font-semibold">搜索关键词、浏览记录</span>。
              用于向您提供更精准的搜索结果，了解您的兴趣偏好，以优化未来向您展示的内容。
            </li>
            <li>
              <strong>账号信息：</strong>当您注册账号以同步或备份行程时，我们需要您提供
              <span className="text-slate-900 font-semibold">手机号码</span>，用于创建账号、验证身份、保障账号安全。
            </li>
          </ul>
        </SubSection>

        <SubSection title="1.2 为您提供内容分享与互动功能">
          <p>
            当您希望分享您的旅行体验时，我们需要调用 <strong>相册/相机权限</strong>。
            在您授权后，我们会访问您的相册或相机，用于读取您希望上传的图片/视频，以发布点评、分享行程或上传头像。
          </p>
        </SubSection>

        <SubSection title="1.3 保障服务安全与正常运行">
          <p>
            为抵御网络攻击、排查崩溃原因，我们需要收集 <strong>设备信息</strong>：
            包括您的设备型号、操作系统版本、唯一设备标识符（如Android ID/IDFA）、IP地址、软件版本号。
            用于识别和防止恶意程序、刷量等破坏性行为，保障服务安全，分析并修复App崩溃、卡顿等问题，提升服务稳定性。
          </p>
        </SubSection>

        <SubSection title="1.4 个性化推荐与产品优化">
          <div className="bg-orange-50 p-4 rounded-md border-l-4 border-orange-400 text-orange-800">
            <strong>注意：</strong>此类个性化推荐功能非核心功能所必需。
            我们将在首次为您推荐前弹窗并单独征得您的同意。您可以在【我的 -&gt; 设置 -&gt; 隐私中心】中随时关闭此功能。
          </div>
        </SubSection>

        <SubSection title="1.5 权限清单">
           <PermissionsTable items={permissionDataCN} />
        </SubSection>
      </Section>

      {/* Chapter 2: Sharing */}
      <Section title="二、个人信息的共享、公开披露与委托处理">
        <p>我们原则上不会与任何第三方共享您的信息。但在以下情形中，我们可能会处理您的信息：</p>
        
        <SubSection title="2.1 委托处理">
           <p>
             为实现特定的业务功能（如提供底层地图服务、客户服务支持、安全的数据存储服务等），我们可能会委托经严格筛选和授权的第三方服务提供商（以下简称"受托方"）处理您的必要个人信息。
           </p>
           <p className="mt-3">
             <strong>我们将通过签订书面协议、进行安全评估等方式，要求受托方严格遵守我们的指令、信息安全规范以及保密义务。</strong>
             我们要求其只能出于提供特定服务之目的处理您的信息，并采取与其处理活动相适应的、符合行业标准的技术和管理安全措施，以防止信息泄露和滥用。并在委托关系结束后及时删除或匿名化处理信息。
           </p>
        </SubSection>

        <SubSection title="2.2 共享">
          <p>
            <strong>我们可能与我们的关联公司（指现在或未来与安思达乐公司存在控制、受控制或共同受控制关系的法律实体）共享您的个人信息。</strong>
            共享将严格限于实现本隐私政策所述目的之必要范围内。关联公司将同样受到本隐私政策的约束，并遵循相同的安全保障标准和保密义务。
          </p>
        </SubSection>

        <SubSection title="2.3 公开披露">
          <p>
            我们不会公开披露您的个人信息，除非获得您的单独同意，或依据法律法规要求必须披露。
          </p>
        </SubSection>

        <SubSection title="2.4 依法提供">
           <p className="font-semibold text-red-600">
             如应司法或行政机关基于法定程序（如调查、诉讼等）的具有法律效力的要求，我们可能会依法提供您的个人信息。
             在此过程中，我们将严格审查所有要求的合法性，并在法律赋予的权限内，最大限度地保护您的个人信息权益，确保任何信息的提供都符合中华人民共和国法律法规的规定。
           </p>
        </SubSection>
      </Section>

      {/* Chapter 3: Storage */}
      <Section title="三、个人信息的存储与保护">
        <ul className="space-y-3">
          <li><strong>存储地点：</strong>中国境内服务器。</li>
          <li><strong>存储期限：</strong>仅为实现目的所必需的期限。注销账号后将删除或匿名化处理。</li>
          <li><strong>安全措施：</strong>采用TLS/SSL加密传输、加密存储及严格的访问控制。</li>
          <li><strong>停止运营：</strong>如停止运营，我们将及时通知并在期限届满后删除数据。</li>
        </ul>
      </Section>

      {/* Chapter 4: User Rights */}
      <Section title="四、您的权利">
        <p className="mb-4">您可以通过 App 内【我的 -&gt; 设置 -&gt; 隐私中心】行使以下权利：</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h4 className="font-bold text-slate-800">访问与更正</h4>
            <p className="text-sm mt-1">查询副本或修改昵称、头像等信息。</p>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h4 className="font-bold text-slate-800">删除权</h4>
            <p className="text-sm mt-1">在处理目的已达成或撤回同意后，请求删除信息。</p>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <h4 className="font-bold text-slate-800">撤回同意</h4>
            <p className="text-sm mt-1">关闭系统权限或个性化推荐。当您发出申请后，我们将会在<strong>25天</strong>内进行处理并反馈。</p>
          </div>
          <div className="p-4 bg-red-50 rounded border border-red-100">
            <h4 className="font-bold text-red-800">注销账号</h4>
            <p className="text-sm mt-1 text-red-700">账号注销不可恢复，处理时效为15个工作日。</p>
          </div>
        </div>
      </Section>

      {/* Chapter 5: Minor Protection - CRITICAL UPDATE */}
      <Section title="五、未成年人保护">
        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-lg">
          <p className="mb-3 font-semibold text-yellow-900">
             如果您是未满14周岁的未成年人：
          </p>
          <p className="mb-4 text-yellow-800 text-sm">
            在使用 afreshtrip 服务前，请您的父母或其他监护人仔细阅读本政策以及
            <strong className="text-blue-700 underline cursor-pointer mx-1" onClick={onNavigateToChildrenPolicy}>
               《afreshtrip儿童个人信息保护声明》
            </strong>。
            我们将会通过监护人注册手机号＋短信验证码的方式核验完成身份确认。
          </p>
          <p className="text-yellow-800 text-sm">
            14-18周岁的用户，建议在监护人指导下使用。涉及支付等敏感功能需额外获得监护人同意。
          </p>
        </div>
      </Section>

      {/* Chapter 6 & 7 */}
      <Section title="六、政策更新与联系我们">
        <p className="mb-4">
          重大变更将通过站内通知告知。如您不同意修改内容，可停止使用服务。
        </p>
        <div className="bg-slate-100 p-4 rounded text-center">
          <p className="font-bold">联系方式</p>
          <p>官网：www.anstalle.com</p>
          <p>客服热线：xxxxxxxxxxxx</p>
        </div>
      </Section>
    </div>
  );
};