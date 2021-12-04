import { update } from '@firebase/database';
import { Input, Modal, Form, Alert, Select, Checkbox } from 'antd';
import React, { useCallback, useState } from 'react';
import { FunctionComponent } from 'react';
import { gamesRef } from '../database';
import { steamGamesList } from '../steamGameList';
import { Game } from '../types';

interface GameEditModalProps {
  game: Game;
  onClose(): void;
}

interface FormValues {
  title: string;
  claimedBy: string;
  donatedBy: string;
  keyGiven: boolean;
}

export const GameEditModal: FunctionComponent<GameEditModalProps> = ({
  game,
  onClose: handleClose
}) => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submitForm = useCallback(async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);
      const values = await form.validateFields();

      await update(gamesRef, {
        [game.id]: {
          title: values.title,
          claimedBy: values.claimedBy || null,
          donatedBy: values.donatedBy || null,
          keyGiven: values.keyGiven || false,
          appId: game.appId
        }
      });

      handleClose();
    } catch (err) {
      console.warn(err);
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }, [game]);

  return (
    <Modal
      onOk={submitForm}
      okButtonProps={{ loading: submitting }}
      okText="Opslaan"
      cancelText="Annuleer"
      onCancel={handleClose}
      visible
      title={game.title}
      width={600}
      keyboard={false}
      maskClosable={false}
      closable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={game}
        colon
        className="grid grid-cols-2 gap-3"
      >
        <Form.Item
          name="title"
          label="Titel"
          rules={[{ required: true, message: 'Titel is verplicht' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="appId" label="Game link">
          <Select
            showSearch
            filterOption={(input, option) =>
              option?.simplifiedname.includes(
                input.toLowerCase().replace(/\W/g, '')
              ) || false
            }
            options={steamGamesList.map((game) => ({
              key: game.appid,
              value: game.appid,
              label: game.name,
              simplifiedname: game.simplifiedName
            }))}
          />
        </Form.Item>
        <Form.Item name="claimedBy" label="Claimed door">
          <Input allowClear />
        </Form.Item>
        <Form.Item valuePropName="checked" name="keyGiven" label="Key gegeven?">
          <Checkbox />
        </Form.Item>
        <Form.Item name="donatedBy" label="Gedoneerd door">
          <Input allowClear />
        </Form.Item>
      </Form>

      {submitError && <Alert type="error" message={submitError} />}
    </Modal>
  );
};
