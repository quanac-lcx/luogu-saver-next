import { ref } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import { useRouter } from 'vue-router';

export function useContentSaver() {
    const dialog = useDialog();
    const message = useMessage();
    const router = useRouter();
    const isSaving = ref(false);

    const handle404 = (saveAction: () => Promise<any>, onCancel?: () => void) => {
        dialog.warning({
            title: '内容未找到',
            content: '该内容尚未被收录，是否立即保存？',
            positiveText: '立即保存',
            negativeText: '返回',
            closable: false,
            closeOnEsc: false,
            maskClosable: false,
            onPositiveClick: async () => {
                try {
                    isSaving.value = true;
                    const res = await saveAction();
                    const taskId = res?.data?.taskId;
                    message.success(taskId ? `保存任务已提交: ${taskId}` : '保存任务已提交');
                } catch (e: any) {
                    message.error(e.message || '保存失败');
                    isSaving.value = false;
                }
            },
            onNegativeClick: () => {
                if (onCancel) onCancel();
                else router.back();
            }
        });
    };

    const stopSaving = () => {
        isSaving.value = false;
    };

    return {
        isSaving,
        handle404,
        stopSaving
    };
}

