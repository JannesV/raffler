import { update } from "@firebase/database";
import { Input, Modal, Form, Alert, Select } from "antd";
import React, { useCallback, useState } from "react";
import { FunctionComponent } from "react";
import { gamesRef } from "../database";
import { steamGamesList } from "../steamGameList";
import { Game } from "../types";

interface GameEditModalProps {
  game: Game;
  onClose(): void;
}

interface FormValues {
  title: string;
  claimedBy: string;
}

export const GameEditModal: FunctionComponent<GameEditModalProps> = ({
  game: { title, claimedBy, id },
  onClose: handleClose,
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
        [id]: {
          title:
            steamGamesList.find((g) => g.simplifiedName === values.title)
              ?.name || values.title,
          claimedBy: values.claimedBy || null,
        },
      });

      handleClose();
    } catch (err) {
      console.warn(err);
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }, []);

  return (
    <Modal
      onOk={submitForm}
      okButtonProps={{ loading: submitting }}
      onCancel={handleClose}
      visible
      title={title}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          title,
          claimedBy,
        }}
        colon
      >
        <Form.Item
          name="title"
          label="Titel"
          rules={[{ required: true, message: "Titel is verplicht" }]}
        >
          <Select
            showSearch
            filterOption={(input, option) => {
              return (
                option?.value
                  ?.toString()
                  .includes(input.toLowerCase().replace(/\W/g, "")) || false
              );
            }}
            options={steamGamesList.map((game) => ({
              key: game.appid,
              value: game.simplifiedName,
              label: game.name,
            }))}
          />
        </Form.Item>
        <Form.Item name="claimedBy" label="Claimed door">
          <Input allowClear />
        </Form.Item>
      </Form>

      {submitError && <Alert type="error" message={submitError} />}
    </Modal>
  );
};
